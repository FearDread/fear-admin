import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Loader, Zap } from 'lucide-react';

// Same pattern the API validates with
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "login me@x.com secret" -> "login me@x.com ********", for the echo and the command history
const redactLogin = (cmd) => cmd.replace(/^(login\s+\S+\s+)\S.*$/, '$1********');

export default function SecurityAgentTerminal() {
    const [history, setHistory] = useState([
        { type: 'banner', timestamp: new Date() },
        { type: 'output', content: 'Initializing agent...', timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentPath, setCurrentPath] = useState('~');
    const [activeServices, setActiveServices] = useState(0);
    const [agentInitialized, setAgentInitialized] = useState(false);
    const [apiBaseUrl, setApiBaseUrl] = useState('http://fear.dedyn.io:4000/fear/api/agent');
    const [currentUser, setCurrentUser] = useState(null);
    // While set, the input line is collecting a credential: { step: 'email' } or { step: 'password', email }
    const [loginPrompt, setLoginPrompt] = useState(null);
    const terminalEndRef = useRef(null);
    const inputRef = useRef(null);

    const logo = `
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@   
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  
@@!       @@!       @@!  @@@  @@!  @@@  
!@!       !@!       !@!  @!@  !@!  @!@  
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!   
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!    
!!:       !!:       !!:  !!!  !!: :!!   
:!:       :!:       :!:  !:!  :!:  !:!  
 ::        :: ::::  ::   :::  ::   :::  
 :        : :: ::    :   : :   :   : :`;

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    // Initialize agent on component mount
    useEffect(() => {
        initializeAgent();
    }, []);

    const addOutput = (text, type = 'output') => {
        setHistory(prev => [...prev, {
            type: type,
            content: text,
            timestamp: new Date()
        }]);
    };

    const echoInput = (text) => {
        setHistory(prev => [...prev, { type: 'input', content: text, timestamp: new Date() }]);
    };

    // Every call carries the session cookie: the agent API is admin-only and "login" is what sets it.
    // (The server must list this page's origin in ALLOWED_ORIGINS for the cookie to be accepted.)
    const request = async (url, method = 'GET', body = null) => {
        const options = {
            method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.message || `API error: ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    };

    const callAgentAPI = (endpoint, method = 'GET', body = null) =>
        request(`${apiBaseUrl}${endpoint}`, method, body);

    // .../fear/api/agent -> .../fear/api/auth
    const getAuthBaseUrl = () =>
        /\/agent\/?$/.test(apiBaseUrl)
            ? apiBaseUrl.replace(/\/agent\/?$/, '/auth')
            : new URL('/fear/api/auth', apiBaseUrl).href;

    const initializeAgent = async () => {
        try {
            await callAgentAPI('/initialize', 'POST');
            setAgentInitialized(true);
            addOutput('Agent initialized successfully');
            addOutput('Type "help" for commands, "status" for system status');
        } catch (error) {
            console.error('Failed to initialize agent:', error);
            setAgentInitialized(false);

            if (error.status === 401) {
                addOutput('Not signed in. Use: login <email> <password>', 'system');
            } else if (error.status === 403) {
                addOutput(`${error.message}. Sign in with an admin account: login <email> <password>`, 'system');
            } else if (error.status === 404) {
                addOutput('The agent API is disabled on this server (AGENT_API_ENABLED)', 'system');
            } else if (error.status) {
                addOutput('Agent initialization failed: ' + error.message, 'system');
            } else {
                addOutput('Failed to connect to agent API', 'system');
            }
            addOutput('Running in offline mode with limited functionality');
        }
    };

    const performLogin = async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.test(normalizedEmail)) {
            addOutput('Invalid email address', 'system');
            return;
        }

        try {
            // The API answers with the user and sets an httpOnly cookie: no token ever reaches this page
            const data = await request(`${getAuthBaseUrl()}/login`, 'POST', { email: normalizedEmail, password });
            const user = data.data?.user || data.result?.user;

            setCurrentUser({ email: user?.email || normalizedEmail, role: user?.role });
            addOutput(`Signed in as ${user?.email || normalizedEmail}${user?.role ? ` (${user.role})` : ''}`);

            // Reconnect the agent now that there is a session (also tells a non-admin they can't use it)
            await initializeAgent();
        } catch (error) {
            addOutput(`Login failed: ${error.message}`, 'system');
        }
    };

    // login <email> <password> | login <email> (asks for the password) | login (asks for both)
    const handleLoginCommand = async (line) => {
        const rest = line.replace(/^login\s*/, '');
        // The email is the first word; everything after it is the password, spaces included
        const match = rest.match(/^(\S+)\s+(\S.*)$/);

        if (match) {
            await performLogin(match[1], match[2]);
            return;
        }

        if (rest) {
            if (!EMAIL_PATTERN.test(rest)) {
                addOutput('Invalid email address', 'system');
                return;
            }
            setLoginPrompt({ step: 'password', email: rest });
            addOutput('Password:');
            return;
        }

        setLoginPrompt({ step: 'email' });
        addOutput('Email:');
    };

    // displayText is what gets echoed; it differs from cmd when cmd holds a password
    const executeCommand = async (cmd, displayText) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        // Add command to history
        echoInput(displayText ?? trimmed);

        setIsProcessing(true);

        const [command, ...args] = trimmed.split(' ');

        try {
            // Handle local commands first
            if (command === 'clear') {
                setHistory([
                    { type: 'output', content: 'Terminal cleared', timestamp: new Date() }
                ]);
                setIsProcessing(false);
                return;
            }

            if (command === 'banner') {
                setHistory(prev => [...prev, { type: 'banner', timestamp: new Date() }]);
                setIsProcessing(false);
                return;
            }

            if (command === 'set-api') {
                if (args[0]) {
                    setApiBaseUrl(args[0]);
                    addOutput(`API base URL set to: ${args[0]}`);
                } else {
                    addOutput(`Current API base URL: ${apiBaseUrl}`);
                }
                setIsProcessing(false);
                return;
            }

            if (command === 'login') {
                await handleLoginCommand(trimmed);
                return;
            }

            if (command === 'logout') {
                await request(`${getAuthBaseUrl()}/logout`, 'POST');
                setCurrentUser(null);
                setAgentInitialized(false);
                addOutput('Signed out');
                return;
            }

            // Handle special API routes
            let result;

            switch (command) {

                case 'status':
                    result = await callAgentAPI('/status', 'GET');
                    if (result.success) {
                        let output = 'SYSTEM STATUS\n\n';
                        if (result.modules) {
                            Object.entries(result.modules).forEach(([name, module]) => {
                                output += `${name.padEnd(25)} [${module.status.toUpperCase()}]\n`;
                            });
                        }
                        if (result.version) {
                            output += `\nVersion: ${result.version.agentVersion || 'Unknown'}`;
                        }
                        addOutput(output);
                    }
                    break;

                case 'history':
                    result = await callAgentAPI(`/history?limit=${args[0] || 20}`, 'GET');
                    if (result.success && result.history) {
                        let output = 'COMMAND HISTORY\n\n';
                        result.history.forEach((cmd, idx) => {
                            output += `${idx + 1}. ${cmd}\n`;
                        });
                        addOutput(output);
                    }
                    break;

                case 'version':
                    result = await callAgentAPI('/version', 'GET');
                    if (result.success) {
                        let output = 'VERSION INFORMATION\n\n';
                        output += `Agent Version: ${result.agentVersion || 'Unknown'}\n`;
                        output += `Node Version: ${result.nodeVersion || 'Unknown'}\n`;
                        output += `Platform: ${result.platform || 'Unknown'}\n`;
                        addOutput(output);
                    }
                    break;

                case 'search-cve':
                    if (args.length < 1) {
                        addOutput('Usage: search-cve <query>');
                    } else {
                        result = await callAgentAPI('/cve/search', 'POST', {
                            query: args.join(' ')
                        });
                        if (result.success) {
                            addOutput(result.output || 'CVE search completed');
                        }
                    }
                    break;

                case 'commands':
                    result = await callAgentAPI('/commands', 'GET');
                    if (result.success && result.commands) {
                        let output = 'AVAILABLE COMMANDS\n\n';
                        Object.entries(result.commands).forEach(([cmd, desc]) => {
                            output += `${cmd.padEnd(25)} - ${desc}\n`;
                        });
                        addOutput(output);
                    }
                    break;

                case 'help':
                    // Show local help with API endpoints
                    const helpText = `SECURITY AI AGENT - COMMAND REFERENCE

ACCOUNT:
  login <email> <password>  - sign in (admin account required)
  login <email>             - sign in, asking for the password (hidden)
  login                     - sign in, asking for email and password
  logout

AI:
  ai-status, ai-provider, ai-explain, ai-threat
  ai-ask, ai-generate, chat-quick, chat-history, chat-clear

CVE & SECURITY:
  search-cve, check-cwe, check-package

CRYPTO:
  crypto-price, compare-rates, crypto-convert
  track-portfolio, market-summary

BACKGROUND SERVICES:
  service-list, service-status, service-start
  service-stop, service-restart, service-logs

PROXIES:
  proxy-status, list-proxies

SYSTEM:
  help, status, history, version, commands, clear, banner
  set-api <url> - Set API base URL

API Status: ${agentInitialized ? 'Connected' : 'Disconnected'}
Signed in: ${currentUser ? currentUser.email : 'no'}
API URL: ${apiBaseUrl}`;
                    addOutput(helpText);
                    break;

                default:
                    // Try to execute via generic API endpoint
                    result = await callAgentAPI('/execute', 'POST', {
                        command: command,
                        args: args
                    });

                    console.log('result = ', result);
                    if (result.success) {

                        if (result.output) {
                            const lines = result.output.split('\n');
                            for (let line of lines) {
                                await new Promise(resolve => setTimeout(resolve, 50));
                                addOutput(line);
                            }
                        } else if (result.message) {
                            addOutput(result.message);
                        } else {
                            addOutput('Command executed successfully');
                        }
                    } else {
                        addOutput(`Command not found: ${command}\nType "help" for available commands`);
                    }
            }

        } catch (error) {
            console.error('Command execution error:', error);
            addOutput(`Error: ${error.message}`, 'system');
            addOutput('Check API connection and try again');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCommand = async () => {
        if (isProcessing) return;

        // While a login prompt is open the input is a credential, not a command. Keep it out of the
        // command history, and never echo a password.
        if (loginPrompt) {
            const value = loginPrompt.step === 'password' ? input : input.trim();
            if (!value) return;
            setInput('');

            if (loginPrompt.step === 'email') {
                echoInput(value);
                if (!EMAIL_PATTERN.test(value)) {
                    addOutput('Invalid email address, try again (Esc to cancel)', 'system');
                    return;
                }
                setLoginPrompt({ step: 'password', email: value });
                addOutput('Password:');
                return;
            }

            echoInput('********');
            setLoginPrompt(null);
            setIsProcessing(true);
            try {
                await performLogin(loginPrompt.email, value);
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        if (!input.trim()) return;

        const cmd = input.trim();
        setCommandHistory(prev => [...prev, redactLogin(cmd)]);
        setHistoryIndex(-1);
        setInput('');

        await executeCommand(cmd, redactLogin(cmd));
    };

    const handleKeyDown = (e) => {
        if (loginPrompt) {
            // Credentials aren't commands: no history recall, and Esc backs out
            if (e.key === 'Escape') {
                e.preventDefault();
                setLoginPrompt(null);
                setInput('');
                addOutput('Login cancelled');
                return;
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
            if (e.key !== 'Enter') return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex + 1;
                if (newIndex < commandHistory.length) {
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setHistory([]);
        }
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="terminal-container">
            {/* Header */}
            <div className="terminal-header">
                <div className="terminal-header-left">
                    <Terminal className="terminal-icon" />
                    <span className="terminal-title">FEAR Security Agent v2.4</span>
                    <span className="terminal-title" style={{ fontSize: '0.7rem', marginLeft: '1rem', color: agentInitialized ? '#4ade80' : '#ef4444' }}>
                        [{agentInitialized ? 'CONNECTED' : 'OFFLINE'}{currentUser ? ` · ${currentUser.email}` : ''}]
                    </span>
                </div>
                {activeServices > 0 && (
                    <div className="terminal-services">
                        <Zap className="terminal-services-icon" />
                        <span>{activeServices} services</span>
                    </div>
                )}
            </div>

            {/* Terminal Content */}
            <div
                className="terminal-content"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((entry, index) => (
                    <div key={index}>
                        {entry.type === 'banner' ? (
                            <pre className="terminal-banner" style={{ textAlign: 'center', color: '#ec1111ff', fontSize: '0.75rem', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                                {logo}
                                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {`═══════════════════════════════════════════════════════
           SECURITY AI AGENT v2.4                    
        Advanced Security Testing Framework           
═══════════════════════════════════════════════════════`}
                                </div>
                            </pre>
                        ) : (
                            <div className="terminal-line">
                                <span className="terminal-timestamp">
                                    [{formatTimestamp(entry.timestamp)}]
                                </span>
                                {entry.type === 'input' ? (
                                    <div className="terminal-prompt">
                                        <ChevronRight className="terminal-chevron" />
                                        <span className="terminal-input-text">{entry.content}</span>
                                    </div>
                                ) : entry.type === 'system' ? (
                                    <span className="terminal-system-text">{entry.content}</span>
                                ) : (
                                    <span className="terminal-output-text">{entry.content}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isProcessing && (
                    <div className="terminal-processing">
                        <span className="terminal-timestamp">
                            [{formatTimestamp(new Date())}]
                        </span>
                        <Loader className="terminal-loader" />
                        <span className="terminal-processing-text">Processing...</span>
                    </div>
                )}

                <div ref={terminalEndRef} />
            </div>

            {/* Input Line */}
            <div className="terminal-input-container">
                <div className="terminal-input-wrapper">
                    <span className="terminal-timestamp">
                        [{formatTimestamp(new Date())}]
                    </span>
                    <span className="terminal-path">({currentPath})</span>
                    {activeServices > 0 && (
                        <span className="terminal-services-badge">[{activeServices} services]</span>
                    )}
                    <ChevronRight className="terminal-chevron" />
                    <input
                        ref={inputRef}
                        type={loginPrompt?.step === 'password' ? 'password' : 'text'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                        placeholder={loginPrompt ? (loginPrompt.step === 'password' ? 'Password' : 'Email') : 'Enter command...'}
                        autoComplete={loginPrompt?.step === 'password' ? 'current-password' : undefined}
                        className="terminal-input"
                        autoFocus
                    />
                    {isProcessing && (
                        <span className="terminal-cursor">_</span>
                    )}
                </div>
            </div>
        </div>
    );
}