'use strict';

/**
 * Terminal side of the agent: banner, help, status and the interactive prompt.
 * The loader (index.js) only pulls builtins() into the HTTP API; everything that touches stdin or
 * ends the process (start, clear, exit) is CLI-only and never registered in 'api' mode.
 */

const readline = require('readline');
const path = require('path');
const colorizer = require('./modules/utils/colorizer');

const VERSION = '2.4.0';

const LOGO = `
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@
@@!       @@!       @@!  @@@  @@!  @@@
!@!       !@!       !@!  @!@  !@!  @!@
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!
!!:       !!:       !!:  !!!  !!: :!!
:!:       :!:       :!:  !:!  :!:  !:!
 ::        :: ::::  ::   :::  ::   :::
 :        : :: ::    :   : :   :   : :
`;

const HELP_CATEGORIES = {
    'File Browser': ['ls', 'cd', 'pwd', 'cat', 'less', 'find', 'file-info', 'tree', 'bookmark', 'browse-help'],
    'AI Analysis (Main)': [
        'ai-setup', 'ai-provider', 'ai-status', 'ai-help', 'ai-analyze', 'ai-batch',
        'ai-compare', 'ai-threat', 'ai-explain', 'ai-generate', 'ai-improve', 'ai-scan', 'ai-ask'
    ],
    'AI Chat (Ollama, free / open source)': [
        'chat', 'chat-quick', 'chat-status', 'chat-model', 'chat-history', 'chat-save', 'chat-load', 'chat-clear', 'chat-export'
    ],
    'Background Services': ['service-start', 'service-stop', 'service-status', 'service-list', 'service-logs', 'service-restart'],
    'Network Scanning': ['scan-ports', 'network-info', 'check-deps', 'security-audit'],
    'Code Analysis': ['analyze-code', 'analyze-project'],
    'Traffic Monitoring': ['monitor-traffic', 'stop-monitor', 'traffic-stats', 'export-traffic'],
    'CVE & Security': ['search-cve', 'check-cwe', 'check-package', 'check-exploits', 'scan-deps', 'export-cve'],
    'Proxy Management': [
        'check-ip', 'configure-proxifly', 'configure-proxy5', 'fetch-proxies', 'add-proxy5',
        'list-proxies', 'select-proxy', 'test-proxy', 'clear-proxy', 'proxy-status', 'proxy-help'
    ],
    'System': ['help', 'status', 'history', 'banner', 'version', 'tips', 'clear', 'exit']
};

/* ----- printers (take the agent, so the same code serves the CLI and the HTTP built-ins) ----- */

const showBanner = () => {
    const banner = [
        '=============================================================',
        '║                                                           ║',
        `║           SECURITY AI AGENT v${VERSION.slice(0, 3)}                          ║`,
        '║           Advanced Security Testing Framework             ║',
        '║                                                           ║',
        '=============================================================',
    ];
    console.log(colorizer.header(LOGO));
    console.log(colorizer.bright(colorizer.cyan(banner.join('\n'))));
    console.log();
    return Promise.resolve();
};

const showStatus = (agent) => {
    console.log(colorizer.section('System Status'));

    agent.definitions.forEach((def) => {
        const mod = agent.modules[def.name];
        const label = colorizer.cyan('  ' + def.displayName.padEnd(22));

        if (!mod) return console.log(label + colorizer.red('[UNAVAILABLE]'));

        if (def.name === 'aiAnalyzer') {
            const ok = mod.isConfigured && mod.isConfigured();
            const provider = mod.getProviderName && mod.getProviderName();
            return console.log(label + (ok ? colorizer.green('[READY - ' + provider + ']') : colorizer.yellow('[NOT CONFIGURED]')));
        }
        if (def.name === 'aiChat') {
            const ok = mod.isConfigured && mod.isConfigured();
            const model = mod.ollama && mod.ollama.model;
            return console.log(label + (ok ? colorizer.green('[READY - Ollama ' + model + ']') : colorizer.yellow('[OLLAMA NOT REACHABLE]')));
        }
        console.log(label + colorizer.green('[READY]'));
    });

    if (agent.backgroundServices.size > 0) {
        console.log();
        console.log(colorizer.section('Background Services'));
        agent.backgroundServices.forEach((service, name) => {
            const running = agent.serviceStatus.get(name) === 'running';
            console.log(colorizer.cyan('  ' + name.padEnd(22)) + (running ? colorizer.green('[RUNNING]') : colorizer.dim('[STOPPED]')));
        });
    }

    console.log();
    console.log(colorizer.magenta('Type "help" for commands, "chat" for AI chat, "exit" to quit'));
    console.log();
    return Promise.resolve();
};

const showHistory = (agent) => {
    console.log(colorizer.section('Command History'));
    if (agent.commandHistory.length === 0) {
        console.log(colorizer.dim('  No commands in history'));
    } else {
        const recent = agent.commandHistory.slice(-20);
        recent.forEach((cmd, i) => console.log(colorizer.numbered(agent.commandHistory.length - recent.length + i + 1, cmd)));
    }
    console.log();
    return Promise.resolve();
};

const showVersion = (agent) => {
    console.log(colorizer.section('Version Information'));
    console.log(colorizer.cyan('  Agent Version: ') + colorizer.bright(VERSION));
    console.log(colorizer.cyan('  Mode: ') + colorizer.bright(agent.mode));
    console.log(colorizer.cyan('  Node Version: ') + colorizer.bright(process.version));
    console.log(colorizer.cyan('  Platform: ') + colorizer.bright(process.platform));
    console.log(colorizer.cyan('  Architecture: ') + colorizer.bright(process.arch));
    console.log(colorizer.cyan('  Loaded Modules: ') + colorizer.bright(Object.keys(agent.modules).length));
    console.log(colorizer.cyan('  Available Commands: ') + colorizer.bright(Object.keys(agent.commands).length));
    console.log();
    return Promise.resolve();
};

const showHelp = (agent) => {
    console.log(colorizer.box('Security AI Agent - Command Reference'));

    Object.entries(HELP_CATEGORIES).forEach(([category, commands]) => {
        const available = commands.filter((cmd) => typeof agent.commands[cmd] === 'function');
        if (available.length === 0) return;

        console.log(colorizer.section(category.toUpperCase()));
        available.forEach((cmd) => {
            const config = agent.mappings[cmd];
            const desc = config ? config.description : 'Show ' + cmd.replace('-', ' ');
            console.log(colorizer.bullet(cmd.padEnd(25) + ' - ' + colorizer.dim(desc)));
        });
        console.log();
    });

    console.log(colorizer.info('Quick Start:'));
    console.log(colorizer.dim('  • "chat" / "chat-quick <question>" talk to the local Ollama model (no API key, no cost)'));
    console.log(colorizer.dim('  • "chat-status" shows which Ollama model the chat is using'));
    console.log(colorizer.dim('  • "service-list" shows the available background services'));
    console.log();
    return Promise.resolve();
};

const showTips = () => {
    console.log(colorizer.section('Tips & Tricks'));
    console.log();
    console.log(colorizer.cyan('Chat vs AI commands:'));
    console.log(colorizer.dim('  • "chat" / "chat-quick" - conversational, runs on local Ollama (free, open source)'));
    console.log(colorizer.dim('  • "ai-*" - security analysis, uses whichever provider ai-setup configured'));
    console.log();
    console.log(colorizer.cyan('Ollama:'));
    console.log(colorizer.dim('  • ollama serve'));
    console.log(colorizer.dim('  • ollama pull llama3.1:8b         (any installed model works, see chat-model)'));
    console.log(colorizer.dim('  • OLLAMA_HOST / OLLAMA_CHAT_MODEL override the defaults'));
    console.log();
    return Promise.resolve();
};

/** Print-only commands. These are the only core commands the HTTP API can register. */
const builtins = (agent) => ({
    help: () => showHelp(agent),
    status: () => showStatus(agent),
    history: () => showHistory(agent),
    banner: () => showBanner(),
    version: () => showVersion(agent),
    tips: () => showTips(),
});

/* ----- interactive prompt ----- */

const getPrompt = (agent) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    let prompt = colorizer.bright(colorizer.cyan('[' + time + '] '));

    const browser = agent.modules.fileBrowser;
    if (browser && browser.currentPath) prompt += colorizer.dim('(' + path.basename(browser.currentPath) + ') ');

    const active = Array.from(agent.serviceStatus.values()).filter((s) => s === 'running').length;
    if (active > 0) prompt += colorizer.yellow(`[${active} services] `);

    return prompt + colorizer.bright(colorizer.green('FEAR >> '));
};

const exit = (agent) => {
    console.log(colorizer.cyan('\nShutting down...'));
    agent.shutdown();
    console.log(colorizer.bright(colorizer.cyan('Goodbye!\n')));
    process.exit(0);
};

const start = (agent) => {
    agent.commands.clear = () => { console.clear(); process.stdout.write('\x1Bc'); };
    agent.commands.exit = () => exit(agent);

    return agent.ready.then(() => {
        showBanner();
        showStatus(agent);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: getPrompt(agent),
            completer: (line) => {
                const all = Object.keys(agent.commands);
                const hits = all.filter((c) => c.startsWith(line));
                return [hits.length ? hits : all, line];
            }
        });

        rl.prompt();
        rl.on('line', (input) => {
            const trimmed = input.trim();
            if (!trimmed) return rl.prompt();

            agent.addToHistory(trimmed);
            rl.setPrompt(getPrompt(agent));
            agent.executeCommand(trimmed).then(() => rl.prompt()).catch(() => rl.prompt());
        });
        rl.on('close', () => exit(agent));
    });
};

module.exports = { VERSION, builtins, start, showBanner, showStatus, showHelp };