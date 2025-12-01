// modules/ai/chat.js - Separate AI Chat Session Module
const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const AiChat = function(agent) {
  this.agent = agent;
  this.conversationHistory = [];
  this.maxHistoryLength = 50;
  this.sessionName = null;
  this.streamMode = false;
  
  // Get AI config from main AI module
  this.getConfig = () => {
    if (this.agent && this.agent.modules && this.agent.modules.aiAnalyzer) {
      return this.agent.modules.aiAnalyzer.config;
    }
    return null;
  };

  this.chatSystemPrompt = `You are a helpful, conversational AI assistant. You can:
- Answer questions on any topic
- Help with coding and debugging
- Provide explanations and tutorials
- Assist with creative writing
- Have casual conversations
- Remember context from earlier in the conversation

Be friendly, helpful, and conversational. Adapt your tone to match the user's style.`;
};

AiChat.prototype = {

  isConfigured() {
    const config = this.getConfig();
    return config && config.isConfigured();
  },

  startSession(args) {
    if (!this.isConfigured()) {
      console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
      console.log(colorizer.info('Example: ai-setup anthropic sk-ant-...\n'));
      return Promise.resolve();
    }

    const config = this.getConfig();
    
    console.log(colorizer.header('🤖 AI Chat Session'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Provider: ') + colorizer.bright(config.getProviderName()));
    console.log(colorizer.cyan('Model: ') + colorizer.dim(config.getModel()));
    console.log(colorizer.cyan('Session: ') + (this.sessionName || 'Unnamed'));
    console.log();
    console.log(colorizer.info('Chat Commands:'));
    console.log(colorizer.dim('  /exit, /quit     - Exit chat session'));
    console.log(colorizer.dim('  /clear           - Clear conversation history'));
    console.log(colorizer.dim('  /history         - Show conversation history'));
    console.log(colorizer.dim('  /save <file>     - Save conversation to file'));
    console.log(colorizer.dim('  /load <file>     - Load previous conversation'));
    console.log(colorizer.dim('  /stream          - Toggle streaming mode'));
    console.log(colorizer.dim('  /session <name>  - Name current session'));
    console.log(colorizer.dim('  /export <format> - Export chat (txt/json/md)'));
    console.log(colorizer.dim('  /help            - Show this help'));
    console.log();
    console.log(colorizer.success('Chat started! Ask me anything...\n'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.getPrompt()
    });

    const handleInput = (input) => {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        rl.prompt();
        return;
      }

      // Handle chat commands
      if (trimmedInput.startsWith('/')) {
        return this.handleChatCommand(trimmedInput, rl)
          .then(result => {
            if (result && result.exit) {
              rl.close();
              return;
            }
            if (result && result.streamMode !== undefined) {
              this.streamMode = result.streamMode;
            }
            rl.prompt();
          });
      }

      // Add user message to history
      this.addToHistory('user', trimmedInput);

      // Build prompt with context
      const prompt = this.buildPromptWithHistory(trimmedInput);

      console.log(colorizer.dim('AI: '));

      // Use streaming if enabled and supported
      if (this.streamMode && (config.provider === 'google' || config.provider === 'ollama')) {
        let response = '';
        config.callStream(prompt, 4096, (chunk) => {
          process.stdout.write(chunk);
          response += chunk;
        })
          .then(() => {
            console.log('\n');
            this.addToHistory('assistant', response);
            rl.prompt();
          })
          .catch(err => {
            console.log(colorizer.error('\n\nError: ' + err.message + '\n'));
            rl.prompt();
          });
      } else {
        // Regular non-streaming response
        config.call(prompt, 4096)
          .then(response => {
            console.log(response + '\n');
            this.addToHistory('assistant', response);
            rl.prompt();
          })
          .catch(err => {
            console.log(colorizer.error('\nError: ' + err.message + '\n'));
            rl.prompt();
          });
      }
    };

    rl.prompt();
    rl.on('line', handleInput);

    return new Promise((resolve) => {
      rl.on('close', () => {
        console.log(colorizer.info('\n👋 Chat session ended.\n'));
        resolve();
      });
    });
  },

  quickQuery(args) {
    if (!this.isConfigured()) {
      console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
      return Promise.resolve();
    }

    const query = args.join(' ');
    if (!query) {
      console.log(colorizer.error('Usage: chat-quick <your question>'));
      console.log(colorizer.info('Example: chat-quick What is Node.js?\n'));
      return Promise.resolve();
    }

    const config = this.getConfig();
    
    console.log(colorizer.header('🤖 Quick Chat'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Query: ') + colorizer.bright(query));
    console.log(colorizer.cyan('Provider: ') + colorizer.bright(config.getProviderName()));
    console.log();

    const prompt = this.buildPromptWithHistory(query);

    return config.call(prompt, 3000)
      .then(response => {
        console.log(response);
        console.log('\n' + colorizer.separator());
        console.log(colorizer.info('💡 Tip: Use "chat" for interactive conversation\n'));
        
        // Add to history for context
        this.addToHistory('user', query);
        this.addToHistory('assistant', response);
      })
      .catch(err => {
        console.log(colorizer.error('Chat failed: ' + err.message + '\n'));
      });
  },

  handleChatCommand(command, rl) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case '/exit':
      case '/quit':
        return Promise.resolve({ exit: true });

      case '/clear':
        this.conversationHistory = [];
        console.log(colorizer.success('Conversation history cleared.\n'));
        return Promise.resolve();

      case '/history':
        return this.showHistory();

      case '/save':
        const saveFile = args[0] || `chat_${Date.now()}.txt`;
        return this.saveToFile(saveFile);

      case '/load':
        const loadFile = args[0];
        if (!loadFile) {
          console.log(colorizer.error('Usage: /load <filename>\n'));
          return Promise.resolve();
        }
        return this.loadFromFile(loadFile);

      case '/stream':
        const config = this.getConfig();
        if (config.provider === 'google' || config.provider === 'ollama') {
          this.streamMode = !this.streamMode;
          console.log(colorizer.success(`Streaming mode ${this.streamMode ? 'enabled' : 'disabled'}.\n`));
          return Promise.resolve({ streamMode: this.streamMode });
        } else {
          console.log(colorizer.warning('Streaming only available with Google Gemini or Ollama.\n'));
          return Promise.resolve();
        }

      case '/session':
        this.sessionName = args.join(' ') || null;
        console.log(colorizer.success(`Session named: ${this.sessionName || 'Unnamed'}\n`));
        return Promise.resolve();

      case '/export':
        const format = args[0] || 'txt';
        const exportFile = args[1] || `chat_export_${Date.now()}.${format}`;
        return this.exportChat(format, exportFile);

      case '/help':
        console.log(colorizer.info('Available chat commands:'));
        console.log(colorizer.dim('  /exit, /quit     - Exit chat session'));
        console.log(colorizer.dim('  /clear           - Clear conversation history'));
        console.log(colorizer.dim('  /history         - Show conversation history'));
        console.log(colorizer.dim('  /save <file>     - Save conversation'));
        console.log(colorizer.dim('  /load <file>     - Load conversation'));
        console.log(colorizer.dim('  /stream          - Toggle streaming'));
        console.log(colorizer.dim('  /session <name>  - Name session'));
        console.log(colorizer.dim('  /export <format> - Export (txt/json/md)'));
        console.log(colorizer.dim('  /help            - Show this help\n'));
        return Promise.resolve();

      default:
        console.log(colorizer.warning('Unknown command. Type /help for available commands.\n'));
        return Promise.resolve();
    }
  },

  buildPromptWithHistory(currentQuery) {
    let prompt = this.chatSystemPrompt + '\n\n';

    // Add recent conversation history
    if (this.conversationHistory.length > 0) {
      prompt += 'Previous conversation:\n';
      // Only include last 10 exchanges for context
      const recentHistory = this.conversationHistory.slice(-20);
      recentHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `Current user message: ${currentQuery}\n\n`;
    prompt += 'Provide a helpful, conversational response.';

    return prompt;
  },

  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Trim history if too long
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
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
    console.log(colorizer.cyan('Messages: ') + this.conversationHistory.length);
    console.log();

    this.conversationHistory.forEach((msg, index) => {
      const role = msg.role === 'user' ? 
        colorizer.cyan('You') : 
        colorizer.green('AI');
      const time = new Date(msg.timestamp).toLocaleTimeString();
      const preview = msg.content.substring(0, 80) + 
        (msg.content.length > 80 ? '...' : '');
      
      console.log(`${colorizer.dim(`[${time}]`)} ${role}: ${preview}`);
    });

    console.log();
    return Promise.resolve();
  },

  saveToFile(filename) {
    if (this.conversationHistory.length === 0) {
      console.log(colorizer.warning('No conversation to save.\n'));
      return Promise.resolve();
    }

    const config = this.getConfig();
    let content = '# AI Chat Session\n\n';
    content += `**Date:** ${new Date().toISOString()}\n`;
    content += `**Session:** ${this.sessionName || 'Unnamed'}\n`;
    content += `**Provider:** ${config.getProviderName()}\n`;
    content += `**Model:** ${config.getModel()}\n`;
    content += `**Messages:** ${this.conversationHistory.length}\n\n`;
    content += '---\n\n';

    this.conversationHistory.forEach((msg, index) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      content += `### ${msg.role === 'user' ? '👤 You' : '🤖 AI'} - ${time}\n\n`;
      content += msg.content + '\n\n';
      content += '---\n\n';
    });

    return fs.writeFile(filename, content)
      .then(() => {
        console.log(colorizer.success(`💾 Conversation saved to ${filename}\n`));
      })
      .catch(err => {
        console.log(colorizer.error(`Failed to save: ${err.message}\n`));
      });
  },

  loadFromFile(filename) {
    return fs.readFile(filename, 'utf8')
      .then(content => {
        // Parse the saved conversation
        // This is a simple implementation - could be enhanced
        const messages = content.split('---\n\n');
        let loaded = 0;

        messages.forEach(msg => {
          if (msg.includes('### 👤 You')) {
            const content = msg.split('\n\n')[1];
            if (content) {
              this.addToHistory('user', content.trim());
              loaded++;
            }
          } else if (msg.includes('### 🤖 AI')) {
            const content = msg.split('\n\n')[1];
            if (content) {
              this.addToHistory('assistant', content.trim());
              loaded++;
            }
          }
        });

        console.log(colorizer.success(`📂 Loaded ${loaded} messages from ${filename}\n`));
      })
      .catch(err => {
        console.log(colorizer.error(`Failed to load: ${err.message}\n`));
      });
  },

  exportChat(format, filename) {
    if (this.conversationHistory.length === 0) {
      console.log(colorizer.warning('No conversation to export.\n'));
      return Promise.resolve();
    }

    const config = this.getConfig();
    let content = '';

    switch (format.toLowerCase()) {
      case 'json':
        content = JSON.stringify({
          session: this.sessionName,
          date: new Date().toISOString(),
          provider: config.getProviderName(),
          model: config.getModel(),
          messages: this.conversationHistory
        }, null, 2);
        break;

      case 'md':
      case 'markdown':
        content = this.formatAsMarkdown(config);
        break;

      case 'txt':
      default:
        content = this.formatAsText(config);
        break;
    }

    return fs.writeFile(filename, content)
      .then(() => {
        console.log(colorizer.success(`📤 Chat exported to ${filename}\n`));
      })
      .catch(err => {
        console.log(colorizer.error(`Export failed: ${err.message}\n`));
      });
  },

  formatAsMarkdown(config) {
    let md = `# Chat Session: ${this.sessionName || 'Unnamed'}\n\n`;
    md += `- **Date:** ${new Date().toISOString()}\n`;
    md += `- **Provider:** ${config.getProviderName()}\n`;
    md += `- **Model:** ${config.getModel()}\n`;
    md += `- **Messages:** ${this.conversationHistory.length}\n\n`;
    md += '---\n\n';

    this.conversationHistory.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      md += `## ${msg.role === 'user' ? '👤 User' : '🤖 AI'} (${time})\n\n`;
      md += msg.content + '\n\n';
    });

    return md;
  },

  formatAsText(config) {
    let txt = `AI CHAT SESSION\n`;
    txt += `===============\n\n`;
    txt += `Session: ${this.sessionName || 'Unnamed'}\n`;
    txt += `Date: ${new Date().toISOString()}\n`;
    txt += `Provider: ${config.getProviderName()}\n`;
    txt += `Model: ${config.getModel()}\n`;
    txt += `Messages: ${this.conversationHistory.length}\n\n`;
    txt += `${'='.repeat(60)}\n\n`;

    this.conversationHistory.forEach((msg, index) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      txt += `[${index + 1}] ${msg.role === 'user' ? 'YOU' : 'AI'} (${time})\n`;
      txt += `${'-'.repeat(60)}\n`;
      txt += `${msg.content}\n\n`;
    });

    return txt;
  },

  clearHistory() {
    this.conversationHistory = [];
    console.log(colorizer.success('Chat history cleared.\n'));
    return Promise.resolve();
  },

  saveSession(args) {
    const filename = args[0] || `session_${Date.now()}.json`;
    
    const sessionData = {
      name: this.sessionName,
      created: new Date().toISOString(),
      provider: this.getConfig()?.getProviderName(),
      model: this.getConfig()?.getModel(),
      history: this.conversationHistory
    };

    return fs.writeFile(filename, JSON.stringify(sessionData, null, 2))
      .then(() => {
        console.log(colorizer.success(`Session saved to ${filename}\n`));
      })
      .catch(err => {
        console.log(colorizer.error(`Failed to save session: ${err.message}\n`));
      });
  },

  loadSession(args) {
    const filename = args[0];
    if (!filename) {
      console.log(colorizer.error('Usage: chat-load <filename>\n'));
      return Promise.resolve();
    }

    return fs.readFile(filename, 'utf8')
      .then(data => {
        const sessionData = JSON.parse(data);
        this.sessionName = sessionData.name;
        this.conversationHistory = sessionData.history || [];
        
        console.log(colorizer.success(`Session loaded: ${this.sessionName || 'Unnamed'}`));
        console.log(colorizer.cyan(`Messages: ${this.conversationHistory.length}\n`));
      })
      .catch(err => {
        console.log(colorizer.error(`Failed to load session: ${err.message}\n`));
      });
  },

  getPrompt() {
    const config = this.getConfig();
    let prompt = colorizer.cyan('>> ');
    
    if (this.sessionName) {
      prompt += colorizer.dim(`[${this.sessionName}] `);
    }
    
    if (this.streamMode) {
      prompt += colorizer.yellow('FEAR AI: ');
    }
    
    prompt += colorizer.bright('You: ');
    return prompt;
  }
};

module.exports = AiChat;