// modules/ai/config.js - Enhanced AI Configuration & Provider Management with Ollama
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const colorizer = require('../utils/colorizer');

const AIConfig = function () {
  // Provider instances
  this.anthropic = null;
  this.openai = null;
  this.googleAi = null;
  this.ollama = null;
  
  // API keys
  this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  this.openaiKey = process.env.OPENAI_API_KEY || '';
  this.googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
  
  // Ollama configuration
  this.ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  this.ollamaModel = process.env.OLLAMA_MODEL || 'ai-code';
  
  // Current provider
  this.provider = process.env.AI_PROVIDER || 'openai';

  // Model configurations
  this.models = {
    anthropic: 'claude-sonnet-4-5-20250929',
    openai: 'gpt-4o',
    google: 'gemini-2.0-flash-exp',
    ollama: this.ollamaModel
  };

  // Ollama model presets
  this.ollamaPresets = {
    'chat-ai': { base: 'llama3-chatqa:8b', temperature: 0.7, ctx: 8192 },
    'code-ai': { base: 'qwen2.5-coder:7b', temperature: 0.2, ctx: 8192 }
  };

  // Google safety settings
  this.googleSafetySettings = [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    }
  ];

  // Initialize providers if keys exist
  this.initializeProviders();
};

AIConfig.prototype = {
  
  initializeProviders() {
    // Initialize Anthropic
    if (this.anthropicKey) {
      try {
        this.anthropic = new Anthropic({ apiKey: this.anthropicKey });
        console.log(colorizer.dim('  ✓ Anthropic initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ Anthropic SDK error: ' + err.message));
      }
    }

    // Initialize OpenAI
    if (this.openaiKey) {
      try {
        this.openai = new OpenAI({ apiKey: this.openaiKey });
        console.log(colorizer.dim('  ✓ OpenAI initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ OpenAI SDK error: ' + err.message));
      }
    }

    // Initialize Google Gemini
    if (this.googleKey) {
      try {
        this.googleAi = new GoogleGenerativeAI(this.googleKey);
        console.log(colorizer.dim('  ✓ Google Gemini initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ Google SDK error: ' + err.message));
      }
    }

    // Initialize Ollama (check if server is available)
    this.checkOllamaAvailability();

    // Auto-select first available provider if current is not configured
    if (!this.isConfigured()) {
      if (this.openai) this.provider = 'openai';
      else if (this.googleAi) this.provider = 'google';
      else if (this.anthropic) this.provider = 'anthropic';
      else if (this.ollama) this.provider = 'ollama';
    }
  },

  async checkOllamaAvailability() {
    try {
      const response = await axios.get(`${this.ollamaHost}/api/tags`, { timeout: 2000 });
      if (response.status === 200) {
        this.ollama = { 
          available: true, 
          models: response.data.models || [] 
        };
        console.log(colorizer.dim('Ollama initialized'));
        
        // Check if our custom models exist
        const modelNames = this.ollama.models.map(m => m.name);
        if (modelNames.includes('chat-ai') || modelNames.includes('code-ai')) {
          console.log(colorizer.dim('Found custom models: ' + 
            modelNames.filter(m => m === 'chat-ai' || m === 'code-ai').join(', ')));
        }
      }
    } catch (err) {
      // Ollama not available - silent fail
      this.ollama = null;
    }
  },

  setup(args) {
    if (args.length === 0) {
      return this.showSetupInfo();
    }

    const provider = args[0]?.toLowerCase();
    const key = args[1];

    // Special handling for Ollama (no key required)
    if (provider === 'ollama') {
      return this.setupOllama(key || 'chat-ai', args[2]);
    }

    if (!key) {
      console.log(colorizer.error('Please provide an API key\n'));
      return Promise.resolve();
    }

    switch (provider) {
      case 'anthropic':
      case 'claude':
        return this.setupAnthropic(key);

      case 'openai':
      case 'gpt':
        return this.setupOpenAI(key);

      case 'google':
      case 'gemini':
        return this.setupGoogle(key);

      default:
        console.log(colorizer.error('Unknown provider. Use "anthropic", "openai", "google", or "ollama"\n'));
        return Promise.resolve();
    }
  },

  async setupOllama(model, host) {
    try {
      const ollamaHost = host || this.ollamaHost;
      
      // Test connection
      const response = await axios.get(`${ollamaHost}/api/tags`, { timeout: 3000 });
      
      if (response.status !== 200) {
        throw new Error('Ollama server not responding');
      }

      const availableModels = response.data.models || [];
      const modelNames = availableModels.map(m => m.name);

      // Check if requested model exists
      if (!modelNames.includes(model)) {
        console.log(colorizer.warning(`Model "${model}" not found on Ollama server`));
        console.log(colorizer.info('Available models:'));
        modelNames.forEach(m => console.log(colorizer.dim('  • ' + m)));
        console.log();
        console.log(colorizer.info('To create custom models, run:'));
        console.log(colorizer.dim('  ollama create ai-chat -f Modelfile.chat-ai'));
        console.log(colorizer.dim('  ollama create ai-code -f Modelfile.code-ai'));
        console.log();
        return Promise.resolve(false);
      }

      this.ollamaHost = ollamaHost;
      this.ollamaModel = model;
      this.models.ollama = model;
      this.ollama = { 
        available: true, 
        models: availableModels 
      };
      this.provider = 'ollama';

      console.log(colorizer.success('Ollama configured successfully!'));
      console.log(colorizer.cyan('Host: ') + colorizer.bright(ollamaHost));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(model));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure Ollama: ' + err.message));
      console.log(colorizer.info('Make sure Ollama is running:'));
      console.log(colorizer.dim('  ollama serve'));
      console.log();
      return Promise.resolve(false);
    }
  },

  setupGoogle(key) {
    try {
      this.googleKey = key;
      this.googleAi = new GoogleGenerativeAI(key);
      this.provider = 'google';

      console.log(colorizer.success('Google Gemini configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.google));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure Google: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  setupAnthropic(key) {
    try {
      this.anthropicKey = key;
      this.anthropic = new Anthropic({ apiKey: key });
      this.provider = 'anthropic';

      console.log(colorizer.success('Anthropic Claude configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.anthropic));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure Anthropic: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  setupOpenAI(key) {
    try {
      this.openaiKey = key;
      this.openai = new OpenAI({ apiKey: key });
      this.provider = 'openai';

      console.log(colorizer.success('OpenAI configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.openai));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure OpenAI: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  showSetupInfo() {
    console.log(colorizer.header('AI API Configuration'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Usage: ') + colorizer.bright('ai-setup <provider> <api-key|model>'));
    console.log();

    console.log(colorizer.section('Available Providers'));
    console.log(colorizer.bullet('anthropic (claude) - Anthropic Claude'));
    console.log(colorizer.dim('    Model: ' + this.models.anthropic));
    console.log(colorizer.bullet('openai (gpt)       - OpenAI GPT'));
    console.log(colorizer.dim('    Model: ' + this.models.openai));
    console.log(colorizer.bullet('google (gemini)    - Google Gemini'));
    console.log(colorizer.dim('    Model: ' + this.models.google));
    console.log(colorizer.bullet('ollama             - Local Ollama'));
    console.log(colorizer.dim('    Model: ' + this.models.ollama + ' (customizable)'));
    console.log();

    console.log(colorizer.section('Examples'));
    console.log(colorizer.dim('  ai-setup anthropic sk-ant-your-key-here'));
    console.log(colorizer.dim('  ai-setup openai sk-your-openai-key-here'));
    console.log(colorizer.dim('  ai-setup google your-gemini-key-here'));
    console.log(colorizer.dim('  ai-setup ollama ai-chati'));
    console.log(colorizer.dim('  ai-setup ollama ai-code'));
    console.log();

    console.log(colorizer.section('Ollama Setup'));
    console.log(colorizer.info('Create custom Ollama models:'));
    console.log();
    console.log(colorizer.dim('1. Chat Model (llama3-chatqa):'));
    console.log(colorizer.dim('   cat > Modelfile.ai-chat << \'EOF\''));
    console.log(colorizer.dim('   FROM llama3-chatqa:8b'));
    console.log(colorizer.dim('   PARAMETER num_ctx 8192'));
    console.log(colorizer.dim('   PARAMETER temperature 0.7'));
    console.log(colorizer.dim('   EOF'));
    console.log(colorizer.dim('   ollama create chat-ai -f Modelfile.chat-ai'));
    console.log();
    console.log(colorizer.dim('2. Code Model (qwen2.5-coder):'));
    console.log(colorizer.dim('   cat > Modelfile.ai-code << \'EOF\''));
    console.log(colorizer.dim('   FROM qwen2.5-coder:7b'));
    console.log(colorizer.dim('   PARAMETER num_ctx 8192'));
    console.log(colorizer.dim('   PARAMETER temperature 0.2'));
    console.log(colorizer.dim('   TEMPLATE """{{- if .Suffix }}<|fim_prefix|>{{ .Prompt }}<|fim_suffix|>{{ .Suffix }}<|fim_middle|>{{ else }}User: {{ .Prompt }}'));
    console.log(colorizer.dim('   Assistant:{{ end }}"""'));
    console.log(colorizer.dim('   EOF'));
    console.log(colorizer.dim('   ollama create code-ai -f Modelfile.code-ai'));
    console.log();

    console.log(colorizer.section('Environment Variables'));
    console.log(colorizer.dim('  export ANTHROPIC_API_KEY=your-key'));
    console.log(colorizer.dim('  export OPENAI_API_KEY=your-key'));
    console.log(colorizer.dim('  export GOOGLE_API_KEY=your-key'));
    console.log(colorizer.dim('  export OLLAMA_HOST=http://localhost:11434'));
    console.log(colorizer.dim('  export OLLAMA_MODEL=chat-ai'));
    console.log(colorizer.dim('  export AI_PROVIDER=anthropic|openai|google|ollama'));
    console.log();

    console.log(colorizer.section('Current Status'));
    console.log(colorizer.cyan('  Provider: ') + colorizer.bright(this.getProviderName()));
    console.log(colorizer.cyan('  Status: ') +
      (this.isConfigured() ? colorizer.green('Configured') : colorizer.red('Not configured')));
    
    if (!this.isConfigured() && (this.anthropic || this.openai || this.googleAi || this.ollama)) {
      console.log();
      console.log(colorizer.info('Other providers available:'));
      if (this.anthropic && this.provider !== 'anthropic') {
        console.log(colorizer.dim('  Run "ai-provider anthropic" to switch'));
      }
      if (this.openai && this.provider !== 'openai') {
        console.log(colorizer.dim('  Run "ai-provider openai" to switch'));
      }
      if (this.googleAi && this.provider !== 'google') {
        console.log(colorizer.dim('  Run "ai-provider google" to switch'));
      }
      if (this.ollama && this.provider !== 'ollama') {
        console.log(colorizer.dim('  Run "ai-provider ollama" to switch'));
      }
    }
    console.log();

    return Promise.resolve();
  },

  setProvider(args) {
    const provider = args[0]?.toLowerCase();

    if (!provider) {
      return this.showProviderInfo();
    }

    // Normalize provider names
    const normalizedProvider = provider === 'claude' ? 'anthropic' :
                              provider === 'gpt' ? 'openai' :
                              provider === 'gemini' ? 'google' :
                              provider;

    if (normalizedProvider === 'anthropic' && this.anthropic) {
      this.provider = 'anthropic';
      console.log(colorizer.success('Switched to Anthropic Claude'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.anthropic));
      console.log();
    } else if (normalizedProvider === 'openai' && this.openai) {
      this.provider = 'openai';
      console.log(colorizer.success('Switched to OpenAI GPT'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.openai));
      console.log();
    } else if (normalizedProvider === 'google' && this.googleAi) {
      this.provider = 'google';
      console.log(colorizer.success('Switched to Google Gemini'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.google));
      console.log();
    } else if (normalizedProvider === 'ollama' && this.ollama) {
      this.provider = 'ollama';
      console.log(colorizer.success('Switched to Ollama'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.ollama));
      console.log(colorizer.cyan('Host: ') + colorizer.dim(this.ollamaHost));
      console.log();
    } else {
      console.log(colorizer.error(provider + ' is not configured. Use ai-setup first.\n'));
    }

    return Promise.resolve();
  },

  showProviderInfo() {
    console.log(colorizer.header('AI Provider Management'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Usage: ') + colorizer.bright('ai-provider <anthropic|openai|google|ollama>'));
    console.log();

    console.log(colorizer.section('Current Provider'));
    console.log(colorizer.cyan('  Active: ') + colorizer.bright(this.getProviderName()));
    console.log(colorizer.cyan('  Model: ') + colorizer.dim(this.getModel()));
    console.log();

    console.log(colorizer.section('Available Providers'));
    console.log(colorizer.cyan('  Anthropic Claude: ') +
      (this.anthropic ? colorizer.green('Available') : colorizer.red('✗ Not configured')));
    if (this.anthropic) {
      console.log(colorizer.dim('    Model: ' + this.models.anthropic));
    }
    
    console.log(colorizer.cyan('  OpenAI GPT:       ') +
      (this.openai ? colorizer.green('Available') : colorizer.red('✗ Not configured')));
    if (this.openai) {
      console.log(colorizer.dim('    Model: ' + this.models.openai));
    }
    
    console.log(colorizer.cyan('  Google Gemini:    ') +
      (this.googleAi ? colorizer.green('Available') : colorizer.red('✗ Not configured')));
    if (this.googleAi) {
      console.log(colorizer.dim('    Model: ' + this.models.google));
    }
    
    console.log(colorizer.cyan('  Ollama (Local):   ') +
      (this.ollama ? colorizer.green('Available') : colorizer.red('✗ Not configured')));
    if (this.ollama) {
      console.log(colorizer.dim('    Model: ' + this.models.ollama));
      console.log(colorizer.dim('    Host: ' + this.ollamaHost));
      console.log(colorizer.dim('    Available models: ' + 
        this.ollama.models.map(m => m.name).join(', ')));
    }
    console.log();

    return Promise.resolve();
  },

  isConfigured() {
    if (this.provider === 'openai') return !!this.openai;
    if (this.provider === 'google') return !!this.googleAi;
    if (this.provider === 'anthropic') return !!this.anthropic;
    if (this.provider === 'ollama') return !!this.ollama;
    return false;
  },

  getProviderName() {
    if (this.provider === 'openai') return 'OpenAI GPT';
    if (this.provider === 'google') return 'Google Gemini';
    if (this.provider === 'anthropic') return 'Anthropic Claude';
    if (this.provider === 'ollama') return 'Ollama (Local)';
    return 'Unknown';
  },

  getProvider() {
    return this.provider;
  },

  getClient() {
    if (this.provider === 'openai') return this.openai;
    if (this.provider === 'google') return this.googleAi;
    if (this.provider === 'anthropic') return this.anthropic;
    if (this.provider === 'ollama') return this.ollama;
    return null;
  },

  getModel() {
    return this.models[this.provider];
  },

  // Ollama API call
  async callOllama(prompt, maxTokens = 4096) {
    if (!this.ollama) {
      throw new Error('Ollama not configured');
    }

    try {
      const response = await axios.post(`${this.ollamaHost}/api/generate`, {
        model: this.ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          num_predict: maxTokens,
          temperature: this.ollamaPresets[this.ollamaModel]?.temperature || 0.7,
          num_ctx: this.ollamaPresets[this.ollamaModel]?.ctx || 8192
        }
      });

      return response.data.response;
    } catch (err) {
      throw new Error('Ollama request failed: ' + err.message);
    }
  },

  // Ollama streaming call
  async callOllamaStream(prompt, maxTokens = 4096, onChunk) {
    if (!this.ollama) {
      throw new Error('Ollama not configured');
    }

    try {
      const response = await axios.post(`${this.ollamaHost}/api/generate`, {
        model: this.ollamaModel,
        prompt: prompt,
        stream: true,
        options: {
          num_predict: maxTokens,
          temperature: this.ollamaPresets[this.ollamaModel]?.temperature || 0.7,
          num_ctx: this.ollamaPresets[this.ollamaModel]?.ctx || 8192
        }
      }, {
        responseType: 'stream'
      });

      let fullText = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          try {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              const data = JSON.parse(line);
              if (data.response) {
                fullText += data.response;
                if (onChunk) {
                  onChunk(data.response);
                }
              }
              
              if (data.done) {
                resolve(fullText);
              }
            }
          } catch (err) {
            // Ignore parse errors for incomplete chunks
          }
        });

        response.data.on('error', (err) => {
          reject(new Error('Ollama stream error: ' + err.message));
        });
      });
    } catch (err) {
      throw new Error('Ollama stream request failed: ' + err.message);
    }
  },

  // Google Gemini API call
  async callGoogle(prompt, maxTokens = 4096) {
    if (!this.googleAi) {
      throw new Error('Google Gemini not configured');
    }

    try {
      const model = this.googleAi.getGenerativeModel({
        model: this.models.google,
        safetySettings: this.googleSafetySettings,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      if (err.message.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Try rephrasing your query.');
      }
      throw err;
    }
  },

  // Google Gemini streaming call
  async callGoogleStream(prompt, maxTokens = 4096, onChunk) {
    if (!this.googleAi) {
      throw new Error('Google Gemini not configured');
    }

    try {
      const model = this.googleAi.getGenerativeModel({
        model: this.models.google,
        safetySettings: this.googleSafetySettings,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const result = await model.generateContentStream(prompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) {
          onChunk(chunkText);
        }
      }

      return fullText;
    } catch (err) {
      if (err.message.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Try rephrasing your query.');
      }
      throw err;
    }
  },

  // Anthropic API call
  callAnthropic(prompt, maxTokens = 4096) {
    if (!this.anthropic) {
      return Promise.reject(new Error('Anthropic not configured'));
    }

    return this.anthropic.messages.create({
      model: this.models.anthropic,
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }).then(message => message.content[0].text);
  },

  // OpenAI API call
  callOpenAI(prompt, maxTokens = 4096) {
    if (!this.openai) {
      return Promise.reject(new Error('OpenAI not configured'));
    }

    return this.openai.chat.completions.create({
      model: this.models.openai,
      max_tokens: maxTokens,
      messages: [{
        role: 'system',
        content: 'You are an expert cybersecurity analyst and software development consultant.'
      }, {
        role: 'user',
        content: prompt
      }]
    }).then(completion => completion.choices[0].message.content);
  },

  // Universal call method
  call(prompt, maxTokens = 4096) {
    if (!this.isConfigured()) {
      return Promise.reject(new Error('AI not configured. Use ai-setup first.'));
    }

    if (this.provider === 'openai') {
      return this.callOpenAI(prompt, maxTokens);
    } else if (this.provider === 'google') {
      return this.callGoogle(prompt, maxTokens);
    } else if (this.provider === 'anthropic') {
      return this.callAnthropic(prompt, maxTokens);
    } else if (this.provider === 'ollama') {
      return this.callOllama(prompt, maxTokens);
    }

    return Promise.reject(new Error('Invalid provider configuration'));
  },

  // Streaming call method
  async callStream(prompt, maxTokens = 4096, onChunk) {
    if (!this.isConfigured()) {
      throw new Error('AI not configured. Use ai-setup first.');
    }

    if (this.provider === 'google') {
      return this.callGoogleStream(prompt, maxTokens, onChunk);
    } else if (this.provider === 'ollama') {
      return this.callOllamaStream(prompt, maxTokens, onChunk);
    } else {
      // For non-streaming providers, simulate streaming
      const response = await this.call(prompt, maxTokens);
      if (onChunk) {
        onChunk(response);
      }
      return response;
    }
  }
};

module.exports = AIConfig;