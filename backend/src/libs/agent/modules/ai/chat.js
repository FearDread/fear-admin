'use strict';

/**
 * AI chat session, backed by a local Ollama model (free, open source). Independent of the analyzer's
 * provider, so chatting never touches a paid API. Setup is automatic: on load it probes Ollama and
 * picks a model (see ollama.js); `chat-status` shows what it chose, `chat-model <name>` switches.
 */

const readline = require('readline');
const fs = require('fs').promises;
const colorizer = require('../utils/colorizer');
const OllamaClient = require('./ollama');

const MAX_HISTORY = 50;      // messages kept
const CONTEXT_MESSAGES = 20; // messages sent with each request

const SYSTEM_PROMPT = `You are a helpful, conversational AI assistant. You can answer questions on any topic, help with coding and debugging, explain concepts, assist with writing, and remember earlier context in the conversation. Be friendly, clear and concise, and match the user's tone.`;

const AiChat = function () {
    this.ollama = new OllamaClient();
    this.ready = this.ollama.ready; // the loader waits on this
    this.conversationHistory = [];
    this.sessionName = null;
    this.streamMode = false;
};

AiChat.prototype = {

    isConfigured() {
        return this.ollama.isReady();
    },

    /* ----- core ----- */

    buildMessages(userText) {
        const recent = this.conversationHistory.slice(-CONTEXT_MESSAGES).map(({ role, content }) => ({ role, content }));
        return [{ role: 'system', content: SYSTEM_PROMPT }, ...recent, { role: 'user', content: userText }];
    },

    /** One exchange. History is only updated once the model has actually answered. */
    async reply(userText, onChunk = null) {
        const answer = await this.ollama.chat(this.buildMessages(userText), { onChunk });
        this.addToHistory('user', userText);
        this.addToHistory('assistant', answer);
        return answer;
    },

    addToHistory(role, content) {
        this.conversationHistory.push({ role, content, timestamp: new Date().toISOString() });
        if (this.conversationHistory.length > MAX_HISTORY) {
            this.conversationHistory = this.conversationHistory.slice(-MAX_HISTORY);
        }
    },

    /* ----- commands ----- */

    async quickQuery(args) {
        const query = args.join(' ').trim();
        if (!query) {
            console.log(colorizer.error('Usage: chat-quick <your question>'));
            return;
        }

        await this.ollama.ready;
        try {
            const answer = await this.reply(query);
            console.log(answer);
        } catch (err) {
            console.log(colorizer.error('Chat failed: ' + err.message));
        }
    },

    async status() {
        await this.ollama.refresh();
        const o = this.ollama;

        console.log(colorizer.header('AI Chat (Ollama)'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('  Host: ') + colorizer.bright(o.host));
        console.log(colorizer.cyan('  Status: ') + (o.isReady() ? colorizer.green('ready') : colorizer.red('not ready')));
        console.log(colorizer.cyan('  Model: ') + colorizer.bright(o.model || 'none'));
        if (o.models.length) console.log(colorizer.cyan('  Installed: ') + colorizer.dim(o.models.join(', ')));
        console.log(colorizer.cyan('  History: ') + this.conversationHistory.length + ' messages');
        if (o.problem()) console.log(colorizer.warning('  ' + o.problem()));
        console.log();
    },

    /** chat-model            show the current and installed models
     *  chat-model <name>     switch to an installed model */
    async setModel(args) {
        await this.ollama.refresh();
        const name = args[0];

        if (!name) {
            console.log(colorizer.cyan('Current model: ') + colorizer.bright(this.ollama.model || 'none'));
            console.log(colorizer.cyan('Installed: ') + colorizer.dim(this.ollama.models.join(', ') || 'none'));
            return;
        }

        if (this.ollama.setModel(name)) {
            console.log(colorizer.success('Chat model set to ' + this.ollama.model));
        } else {
            console.log(colorizer.error(`"${name}" is not installed. Installed: ${this.ollama.models.join(', ') || 'none'}`));
            console.log(colorizer.dim(`  ollama pull ${name}`));
        }
    },

    showHistory() {
        if (this.conversationHistory.length === 0) {
            console.log(colorizer.info('No conversation history yet.\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('Conversation History'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Session: ') + (this.sessionName || 'Unnamed'));
        console.log(colorizer.cyan('Messages: ') + this.conversationHistory.length + '\n');

        this.conversationHistory.forEach((msg) => {
            const who = msg.role === 'user' ? colorizer.cyan('You') : colorizer.green('AI');
            const preview = msg.content.substring(0, 80) + (msg.content.length > 80 ? '...' : '');
            console.log(`${colorizer.dim('[' + new Date(msg.timestamp).toLocaleTimeString() + ']')} ${who}: ${preview}`);
        });
        console.log();
        return Promise.resolve();
    },

    clearHistory() {
        this.conversationHistory = [];
        console.log(colorizer.success('Chat history cleared.\n'));
        return Promise.resolve();
    },

    /* ----- CLI only (not exposed over HTTP): interactive session and file save / load / export ----- */

    async startSession() {
        await this.ollama.refresh();
        const problem = this.ollama.problem();
        if (problem) {
            console.log(colorizer.error(problem + '\n'));
            return;
        }

        console.log(colorizer.header('AI Chat Session'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Model: ') + colorizer.bright(this.ollama.model) + colorizer.dim('  (Ollama, local)'));
        console.log(colorizer.dim('Commands: /exit /clear /history /model [name] /stream /session <name> /save <file> /load <file> /export <fmt> /help\n'));

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: this.getPrompt() });

        const ask = async (text) => {
            process.stdout.write(colorizer.dim('AI: '));
            try {
                if (this.streamMode) {
                    await this.reply(text, (chunk) => process.stdout.write(chunk));
                    console.log('\n');
                } else {
                    console.log(await this.reply(text) + '\n');
                }
            } catch (err) {
                console.log(colorizer.error('\nError: ' + err.message + '\n'));
            }
        };

        rl.prompt();
        rl.on('line', async (input) => {
            const text = input.trim();
            if (!text) return rl.prompt();

            if (text.startsWith('/')) {
                const result = await this.handleChatCommand(text);
                if (result && result.exit) return rl.close();
            } else {
                await ask(text);
            }

            rl.setPrompt(this.getPrompt());
            rl.prompt();
        });

        return new Promise((resolve) => rl.on('close', () => {
            console.log(colorizer.info('\nChat session ended.\n'));
            resolve();
        }));
    },

    async handleChatCommand(command) {
        const [cmd, ...args] = command.split(' ');

        switch (cmd.toLowerCase()) {
            case '/exit':
            case '/quit': return { exit: true };
            case '/clear': return this.clearHistory();
            case '/history': return this.showHistory();
            case '/model': return this.setModel(args);
            case '/stream':
                this.streamMode = !this.streamMode;
                console.log(colorizer.success(`Streaming ${this.streamMode ? 'on' : 'off'}.\n`));
                return null;
            case '/session':
                this.sessionName = args.join(' ') || null;
                console.log(colorizer.success(`Session named: ${this.sessionName || 'Unnamed'}\n`));
                return null;
            case '/save': return this.saveSession([args[0] || `session_${Date.now()}.json`]);
            case '/load': return this.loadSession(args);
            case '/export': return this.exportChat(args[0] || 'txt', args[1]);
            default:
                console.log(colorizer.warning('Unknown command. Commands: /exit /clear /history /model /stream /session /save /load /export\n'));
                return null;
        }
    },

    getPrompt() {
        return colorizer.cyan('>> ') + (this.sessionName ? colorizer.dim(`[${this.sessionName}] `) : '') + colorizer.bright('You: ');
    },

    saveSession(args) {
        const filename = args[0] || `session_${Date.now()}.json`;
        const data = {
            name: this.sessionName,
            created: new Date().toISOString(),
            provider: 'ollama',
            model: this.ollama.model,
            history: this.conversationHistory
        };

        return fs.writeFile(filename, JSON.stringify(data, null, 2))
            .then(() => console.log(colorizer.success(`Session saved to ${filename}\n`)))
            .catch((err) => console.log(colorizer.error(`Failed to save session: ${err.message}\n`)));
    },

    loadSession(args) {
        const filename = args[0];
        if (!filename) {
            console.log(colorizer.error('Usage: chat-load <filename>\n'));
            return Promise.resolve();
        }

        return fs.readFile(filename, 'utf8')
            .then((raw) => {
                const data = JSON.parse(raw);
                this.sessionName = data.name;
                this.conversationHistory = Array.isArray(data.history) ? data.history.slice(-MAX_HISTORY) : [];
                console.log(colorizer.success(`Session loaded: ${this.sessionName || 'Unnamed'} (${this.conversationHistory.length} messages)\n`));
            })
            .catch((err) => console.log(colorizer.error(`Failed to load session: ${err.message}\n`)));
    },

    exportChat(format, filename) {
        if (this.conversationHistory.length === 0) {
            console.log(colorizer.warning('No conversation to export.\n'));
            return Promise.resolve();
        }

        const fmt = String(format || 'txt').toLowerCase();
        const out = filename || `chat_export_${Date.now()}.${fmt}`;
        const stamp = new Date().toISOString();
        let content;

        if (fmt === 'json') {
            content = JSON.stringify({ session: this.sessionName, date: stamp, provider: 'ollama', model: this.ollama.model, messages: this.conversationHistory }, null, 2);
        } else if (fmt === 'md' || fmt === 'markdown') {
            content = `# Chat Session: ${this.sessionName || 'Unnamed'}\n\n- **Date:** ${stamp}\n- **Model:** ${this.ollama.model} (Ollama)\n\n---\n\n` +
                this.conversationHistory.map((m) => `## ${m.role === 'user' ? 'User' : 'AI'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n`).join('\n');
        } else {
            content = `AI CHAT SESSION\n===============\nSession: ${this.sessionName || 'Unnamed'}\nDate: ${stamp}\nModel: ${this.ollama.model} (Ollama)\n\n` +
                this.conversationHistory.map((m, i) => `[${i + 1}] ${m.role === 'user' ? 'YOU' : 'AI'}\n${'-'.repeat(60)}\n${m.content}\n`).join('\n');
        }

        return fs.writeFile(out, content)
            .then(() => console.log(colorizer.success(`Chat exported to ${out}\n`)))
            .catch((err) => console.log(colorizer.error(`Export failed: ${err.message}\n`)));
    }
};

module.exports = AiChat;