import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Loader, Zap } from 'lucide-react';

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
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:4000/fear/api/agent');
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

  const initializeAgent = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setAgentInitialized(true);
        addOutput('Agent initialized successfully');
        addOutput('Type "help" for commands, "status" for system status');
      } else {
        addOutput('Agent initialization failed: ' + (data.message || 'Unknown error'), 'system');
        addOutput('Running in offline mode with limited functionality');
      }
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      addOutput('Failed to connect to agent API', 'system');
      addOutput('Running in offline mode with limited functionality');
    }
  };

  const addOutput = (text, type = 'output') => {
    setHistory(prev => [...prev, {
      type: type,
      content: text,
      timestamp: new Date()
    }]);
  };

  const callAgentAPI = async (endpoint, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const executeCommand = async (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add command to history
    setHistory(prev => [...prev, { 
      type: 'input', 
      content: trimmed, 
      timestamp: new Date() 
    }]);

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

      // Handle special API routes
      let result;
      
      switch(command) {
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

        case 'scan-ports':
          result = await callAgentAPI('/scan/ports', 'POST', {
            target: args[0] || 'localhost',
            ports: args[1]
          });
          if (result.success && result.data) {
            addOutput(result.data.output || 'Port scan completed');
          }
          break;

        case 'ai-setup':
          if (args.length < 2) {
            addOutput('Usage: ai-setup <provider> <api-key>');
          } else {
            result = await callAgentAPI('/ai/setup', 'POST', {
              provider: args[0],
              apiKey: args[1]
            });
            if (result.success) {
              addOutput(`AI provider configured: ${args[0]}`);
            }
          }
          break;

        case 'ai-analyze':
        case 'analyze-code':
          if (args.length < 1) {
            addOutput('Usage: ai-analyze <file-path>');
          } else {
            result = await callAgentAPI('/analyze/code', 'POST', {
              path: args[0],
              type: 'file'
            });
            if (result.success && result.data) {
              addOutput(result.data.output || 'Analysis completed');
            }
          }
          break;

        case 'analyze-project':
          if (args.length < 1) {
            addOutput('Usage: analyze-project <project-path>');
          } else {
            result = await callAgentAPI('/analyze/code', 'POST', {
              path: args[0],
              type: 'project'
            });
            if (result.success && result.data) {
              addOutput(result.data.output || 'Project analysis completed');
            }
          }
          break;

        case 'search-cve':
          if (args.length < 1) {
            addOutput('Usage: search-cve <query>');
          } else {
            result = await callAgentAPI('/cve/search', 'POST', {
              query: args.join(' ')
            });
            if (result.success && result.data) {
              addOutput(result.data.output || 'CVE search completed');
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

FILE BROWSER:
  ls, cd, pwd, cat, tree, find

AI ANALYSIS (MAIN):
  ai-setup, ai-status, ai-analyze, ai-batch
  ai-threat, ai-explain, ai-generate

AI CHAT (SEPARATE SESSION):
  chat, chat-quick, chat-history, chat-save

BACKGROUND SERVICES:
  service-start, service-stop, service-list

NETWORK SCANNING:
  scan-ports, network-info, security-audit

CVE & SECURITY:
  search-cve, check-cwe, scan-deps

PROXY MANAGEMENT:
  check-ip, configure-proxifly, list-proxies

SYSTEM:
  help, status, history, version, commands, clear, banner
  set-api <url> - Set API base URL

API Status: ${agentInitialized ? 'Connected' : 'Disconnected'}
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
    if (!input.trim() || isProcessing) return;
    
    const cmd = input.trim();
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    
    await executeCommand(cmd);
  };

  const handleKeyDown = (e) => {
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
            [{agentInitialized ? 'CONNECTED' : 'OFFLINE'}]
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
              <pre className="terminal-banner" style={{ textAlign: 'center', color: '#22d3ee', fontSize: '0.75rem', lineHeight: '1.2', marginBottom: '0.5rem' }}>
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
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Enter command..."
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