'use strict';

/**
 * Minimal Ollama client for the chat agent: free, open-source models running locally, no API key.
 *
 * The host comes from the environment only (OLLAMA_HOST), never from a request, so the HTTP API
 * can't be pointed at another machine.
 *
 *   OLLAMA_HOST          default http://127.0.0.1:11434
 *   OLLAMA_CHAT_MODEL    pin a model; otherwise the first installed one from PREFERRED is used
 */

const axios = require('axios');

const DEFAULT_HOST = 'http://127.0.0.1:11434';

// Tried in order: your tuned preset first, then its base model, then common open models.
const PREFERRED = [
    'chat-ai', 'llama3-chatqa:8b', 'llama3.1:8b', 'llama3.2:3b', 'qwen2.5:7b', 'mistral:7b', 'gemma2:9b', 'phi3:mini'
];

const PROBE_TIMEOUT_MS = 2000;
const CHAT_TIMEOUT_MS = 55 * 1000; // under the controller's 60s command timeout

const matches = (installed, wanted) =>
    installed === wanted ||
    installed === `${wanted}:latest` ||
    (!wanted.includes(':') && installed.startsWith(`${wanted}:`));

class OllamaClient {
    constructor() {
        this.host = (process.env.OLLAMA_HOST || DEFAULT_HOST).replace(/\/+$/, '');
        this.pinned = process.env.OLLAMA_CHAT_MODEL || null;
        this.available = false;
        this.models = [];
        this.model = null;
        this.error = null;
        this.ready = this.refresh();
    }

    /** Re-probes the server and re-resolves the model. Never rejects. */
    async refresh() {
        try {
            const { data } = await axios.get(`${this.host}/api/tags`, { timeout: PROBE_TIMEOUT_MS });
            this.models = (data.models || []).map((m) => m.name);
            this.available = true;
            this.error = null;

            if (!this.model || !this.models.includes(this.model)) this.model = this.resolveModel();
        } catch (err) {
            this.available = false;
            this.models = [];
            this.model = null;
            this.error = err.code === 'ECONNREFUSED' ? 'connection refused' : err.message;
        }
        return this.available && !!this.model;
    }

    resolveModel() {
        const candidates = this.pinned ? [this.pinned, ...PREFERRED] : PREFERRED;
        for (const wanted of candidates) {
            const hit = this.models.find((name) => matches(name, wanted));
            if (hit) return hit;
        }
        // Anything installed beats nothing, but skip embedding-only models.
        return this.models.find((name) => !/embed/i.test(name)) || null;
    }

    isReady() {
        return this.available && !!this.model;
    }

    /** Switches to an installed model. Returns false when it isn't installed. */
    setModel(name) {
        const hit = this.models.find((m) => matches(m, name));
        if (!hit) return false;
        this.model = hit;
        return true;
    }

    /** Why the client isn't usable, with the fix. null when it is usable. */
    problem() {
        if (!this.available) return `Ollama is not reachable at ${this.host} (${this.error}). Start it with: ollama serve`;
        if (!this.model) return 'Ollama is running but has no models. Install one with: ollama pull llama3.1:8b';
        return null;
    }

    /**
     * messages: [{ role: 'system'|'user'|'assistant', content }]. Returns the reply text.
     * With onChunk, streams and calls it per piece (still returns the full text).
     */
    async chat(messages, { maxTokens = 2048, temperature = 0.7, onChunk = null } = {}) {
        if (!this.isReady()) await this.refresh();
        const problem = this.problem();
        if (problem) throw new Error(problem);

        const body = {
            model: this.model,
            messages,
            stream: !!onChunk,
            options: { num_predict: maxTokens, temperature, num_ctx: 8192 }
        };

        if (!onChunk) {
            const { data } = await axios.post(`${this.host}/api/chat`, body, { timeout: CHAT_TIMEOUT_MS });
            return (data.message && data.message.content) || '';
        }

        const response = await axios.post(`${this.host}/api/chat`, body, { timeout: CHAT_TIMEOUT_MS, responseType: 'stream' });

        return new Promise((resolve, reject) => {
            let full = '';
            let buffer = '';

            response.data.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop(); // keep a partial line for the next chunk

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const piece = JSON.parse(line);
                        const text = piece.message && piece.message.content;
                        if (text) { full += text; onChunk(text); }
                    } catch (err) { /* ignore a malformed line */ }
                }
            });
            response.data.on('end', () => resolve(full));
            response.data.on('error', (err) => reject(new Error('Ollama stream error: ' + err.message)));
        });
    }
}

module.exports = OllamaClient;