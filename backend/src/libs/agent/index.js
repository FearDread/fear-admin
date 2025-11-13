// AgentWebInterface.js - Web interface for FEAR Agent Chat
const path = require("path");
const fs = require("fs");

module.exports = AgentInterface = (() => {
  // Private constants
  const DEFAULT_CHAT_LIMIT = 100;
  const SESSION_TIMEOUT = 3600000; // 1 hour
  const MAX_MESSAGE_LENGTH = 10000;

  /**
   * Constructor
   */
  const AgentInterface = function(fearInstance) {
    if (!fearInstance) {
      throw new Error("FEAR instance is required");
    }

    this.fear = fearInstance;
    this.agent = null;
    this.sessions = new Map();
    this.router = null;
    this.logger = fearInstance.getLogger();
    this.env = fearInstance.getEnvironment();

    // Initialize
    this.initializeAgent();
    this.setupRouter();
    this.startSessionCleanup();
  };

  // Consolidated prototype
  AgentInterface.prototype = {
    constructor: AgentInterface,

    /**
     * Initialize the agent instance
     */
    initializeAgent() {
      try {
        const agent = this.fear.getAiAgent();
        if (!agent) {
          throw new Error("Agent service not available");
        }
        this.agent = agent;
        this.logger.info("Agent web interface initialized");
      } catch (error) {
        this.logger.error("Failed to initialize agent:", error);
        throw error;
      }
    },

    /**
     * Setup Express router with all routes
     */
    setupRouter() {
      this.router = this.fear.getRouter()();

      // Health check
      this.router.get("/health", (req, res) => {
        this.handleHealthCheck(req, res);
      });

      // Session management
      this.router.post("/session/create", (req, res) => {
        this.handleCreateSession(req, res);
      });

      this.router.get("/session/:sessionId", (req, res) => {
        this.handleGetSession(req, res);
      });

      this.router.delete("/session/:sessionId", (req, res) => {
        this.handleDeleteSession(req, res);
      });

      this.router.get("/sessions", (req, res) => {
        this.handleListSessions(req, res);
      });

      // Chat operations
      this.router.post("/chat/message", (req, res) => {
        this.handleChatMessage(req, res);
      });

      this.router.get("/chat/history/:sessionId", (req, res) => {
        this.handleGetHistory(req, res);
      });

      this.router.post("/chat/clear/:sessionId", (req, res) => {
        this.handleClearHistory(req, res);
      });

      // Command execution
      this.router.post("/command/execute", (req, res) => {
        this.handleExecuteCommand(req, res);
      });

      this.router.get("/command/list", (req, res) => {
        this.handleListCommands(req, res);
      });

      // Agent status
      this.router.get("/agent/status", (req, res) => {
        this.handleAgentStatus(req, res);
      });

      this.router.get("/agent/modules", (req, res) => {
        this.handleListModules(req, res);
      });

      // Export/Import
      this.router.post("/session/export/:sessionId", (req, res) => {
        this.handleExportSession(req, res);
      });

      this.router.post("/session/import", (req, res) => {
        this.handleImportSession(req, res);
      });

      this.logger.info("Agent web routes configured");
    },

    /**
     * Get the configured router
     */
    getRouter() {
      return this.router;
    },

    /**
     * Health check endpoint
     */
    handleHealthCheck(req, res) {
      const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        agent: this.agent ? "ready" : "unavailable",
        sessions: this.sessions.size,
        uptime: process.uptime()
      };

      res.status(200).json(health);
    },

    /**
     * Create a new chat session
     */
    handleCreateSession(req, res) {
      const { userId, metadata } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required"
        });
      }

      const sessionId = this.generateSessionId();
      const session = {
        id: sessionId,
        userId: userId,
        metadata: metadata || {},
        messages: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      this.sessions.set(sessionId, session);

      this.logger.info(`Session created: ${sessionId} for user: ${userId}`);

      res.status(201).json({
        success: true,
        sessionId: sessionId,
        session: this.sanitizeSession(session)
      });
    },

    /**
     * Get session details
     */
    handleGetSession(req, res) {
      const { sessionId } = req.params;

      const session = this.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      this.updateSessionActivity(sessionId);

      res.status(200).json({
        success: true,
        session: this.sanitizeSession(session)
      });
    },

    /**
     * Delete a session
     */
    handleDeleteSession(req, res) {
      const { sessionId } = req.params;

      if (!this.sessions.has(sessionId)) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      this.sessions.delete(sessionId);

      this.logger.info(`Session deleted: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: "Session deleted successfully"
      });
    },

    /**
     * List all sessions
     */
    handleListSessions(req, res) {
      const { userId } = req.query;

      let sessionList = Array.from(this.sessions.values());

      if (userId) {
        sessionList = sessionList.filter(s => s.userId === userId);
      }

      const sanitized = sessionList.map(s => this.sanitizeSession(s));

      res.status(200).json({
        success: true,
        count: sanitized.length,
        sessions: sanitized
      });
    },

    /**
     * Handle chat message
     */
    handleChatMessage(req, res) {
      const { sessionId, message, command } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          error: "sessionId is required"
        });
      }

      if (!message && !command) {
        return res.status(400).json({
          error: "message or command is required"
        });
      }

      const session = this.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      if (message && message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({
          error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH}`
        });
      }

      // Process the message
      this.processChatMessage(sessionId, message || command, !!command)
        .then(response => {
          this.updateSessionActivity(sessionId);

          res.status(200).json({
            success: true,
            response: response
          });
        })
        .catch(error => {
          this.logger.error("Chat message error:", error);

          res.status(500).json({
            error: "Failed to process message",
            details: error.message
          });
        });
    },

    /**
     * Process chat message through agent
     */
    processChatMessage(sessionId, input, isCommand) {
      return new Promise((resolve, reject) => {
        const session = this.sessions.get(sessionId);

        if (!session) {
          return reject(new Error("Session not found"));
        }

        // Add user message to history
        const userMessage = {
          role: "user",
          content: input,
          timestamp: new Date().toISOString(),
          type: isCommand ? "command" : "message"
        };

        session.messages.push(userMessage);

        // Simulate agent response (integrate with actual agent logic)
        this.invokeAgent(input, isCommand, session)
          .then(agentResponse => {
            const responseMessage = {
              role: "assistant",
              content: agentResponse,
              timestamp: new Date().toISOString(),
              type: "response"
            };

            session.messages.push(responseMessage);

            // Trim history if too long
            if (session.messages.length > DEFAULT_CHAT_LIMIT * 2) {
              session.messages = session.messages.slice(-DEFAULT_CHAT_LIMIT * 2);
            }

            resolve(responseMessage);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    /**
     * Invoke agent for processing
     */
    invokeAgent(input, isCommand, session) {
      return new Promise((resolve, reject) => {
        try {
          if (isCommand) {
            // Execute as command
            this.executeAgentCommand(input)
              .then(result => resolve(result))
              .catch(error => reject(error));
          } else {
            // Process as chat message
            this.processAgentChat(input, session)
              .then(result => resolve(result))
              .catch(error => reject(error));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Execute agent command
     */
    executeAgentCommand(command) {
      return new Promise((resolve, reject) => {
        if (!this.agent || !this.agent.commands) {
          return reject(new Error("Agent not properly initialized"));
        }

        const [cmd, ...args] = command.split(" ");

        if (!this.agent.commands[cmd]) {
          return reject(new Error(`Unknown command: ${cmd}`));
        }

        try {
          const result = this.agent.commands[cmd](args);

          if (result && typeof result.then === "function") {
            result
              .then(output => resolve(this.formatCommandOutput(output)))
              .catch(error => reject(error));
          } else {
            resolve(this.formatCommandOutput(result));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Process chat through AI
     */
    processAgentChat(message, session) {
      return new Promise((resolve, reject) => {
        // Check if AI chat module is available
        if (!this.agent.modules || !this.agent.modules.aiChat) {
          return reject(new Error("AI chat module not available"));
        }

        const aiChat = this.agent.modules.aiChat;

        // Build context from session history
        const context = this.buildChatContext(session);

        // Invoke AI chat
        aiChat.quickQuery([message, ...context])
          .then(response => {
            resolve(response || "No response from AI");
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    /**
     * Build chat context from session
     */
    buildChatContext(session) {
      const recentMessages = session.messages.slice(-10);
      return recentMessages.map(m => m.content);
    },

    /**
     * Format command output
     */
    formatCommandOutput(output) {
      if (typeof output === "string") {
        return output;
      }

      if (typeof output === "object") {
        return JSON.stringify(output, null, 2);
      }

      return String(output);
    },

    /**
     * Get chat history
     */
    handleGetHistory(req, res) {
      const { sessionId } = req.params;
      const { limit, offset } = req.query;

      const session = this.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      let messages = session.messages;

      const limitNum = parseInt(limit) || DEFAULT_CHAT_LIMIT;
      const offsetNum = parseInt(offset) || 0;

      messages = messages.slice(offsetNum, offsetNum + limitNum);

      res.status(200).json({
        success: true,
        sessionId: sessionId,
        total: session.messages.length,
        count: messages.length,
        messages: messages
      });
    },

    /**
     * Clear chat history
     */
    handleClearHistory(req, res) {
      const { sessionId } = req.params;

      const session = this.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      session.messages = [];
      this.updateSessionActivity(sessionId);

      this.logger.info(`Chat history cleared for session: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: "Chat history cleared"
      });
    },

    /**
     * Execute command directly
     */
    handleExecuteCommand(req, res) {
      const { command, args } = req.body;

      if (!command) {
        return res.status(400).json({
          error: "command is required"
        });
      }

      this.executeAgentCommand(command + (args ? " " + args.join(" ") : ""))
        .then(result => {
          res.status(200).json({
            success: true,
            command: command,
            result: result
          });
        })
        .catch(error => {
          res.status(500).json({
            error: "Command execution failed",
            details: error.message
          });
        });
    },

    /**
     * List available commands
     */
    handleListCommands(req, res) {
      if (!this.agent || !this.agent.mappings) {
        return res.status(500).json({
          error: "Agent not properly initialized"
        });
      }

      const commands = Object.entries(this.agent.mappings).map(([cmd, config]) => ({
        command: cmd,
        module: config.module,
        description: config.description
      }));

      res.status(200).json({
        success: true,
        count: commands.length,
        commands: commands
      });
    },

    /**
     * Get agent status
     */
    handleAgentStatus(req, res) {
      const status = {
        ready: !!this.agent,
        modules: this.agent ? Object.keys(this.agent.modules).length : 0,
        commands: this.agent ? Object.keys(this.agent.commands).length : 0,
        sessions: this.sessions.size,
        backgroundServices: this.agent ? this.agent.backgroundServices.size : 0
      };

      // Check AI configuration
      if (this.agent && this.agent.modules.aiAnalyzer) {
        const aiModule = this.agent.modules.aiAnalyzer;
        status.aiConfigured = aiModule.isConfigured ? aiModule.isConfigured() : false;
        status.aiProvider = aiModule.getProviderName ? aiModule.getProviderName() : "unknown";
      }

      res.status(200).json({
        success: true,
        status: status
      });
    },

    /**
     * List loaded modules
     */
    handleListModules(req, res) {
      if (!this.agent || !this.agent.definitions) {
        return res.status(500).json({
          error: "Agent not properly initialized"
        });
      }

      const modules = this.agent.definitions.map(def => ({
        name: def.name,
        displayName: def.displayName,
        loaded: !!this.agent.modules[def.name]
      }));

      res.status(200).json({
        success: true,
        count: modules.length,
        modules: modules
      });
    },

    /**
     * Export session data
     */
    handleExportSession(req, res) {
      const { sessionId } = req.params;
      const { format } = req.body;

      const session = this.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      const exportFormat = format || "json";

      this.exportSessionData(session, exportFormat)
        .then(data => {
          res.status(200).json({
            success: true,
            format: exportFormat,
            data: data
          });
        })
        .catch(error => {
          res.status(500).json({
            error: "Export failed",
            details: error.message
          });
        });
    },

    /**
     * Export session to various formats
     */
    exportSessionData(session, format) {
      return new Promise((resolve, reject) => {
        try {
          switch (format) {
            case "json":
              resolve(JSON.stringify(session, null, 2));
              break;

            case "text":
              const text = session.messages.map(m => 
                `[${m.timestamp}] ${m.role}: ${m.content}`
              ).join("\n");
              resolve(text);
              break;

            case "markdown":
              const markdown = session.messages.map(m =>
                `### ${m.role} (${m.timestamp})\n\n${m.content}\n`
              ).join("\n---\n\n");
              resolve(markdown);
              break;

            default:
              reject(new Error(`Unsupported format: ${format}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Import session data
     */
    handleImportSession(req, res) {
      const { sessionData, userId } = req.body;

      if (!sessionData) {
        return res.status(400).json({
          error: "sessionData is required"
        });
      }

      this.importSessionData(sessionData, userId)
        .then(session => {
          res.status(201).json({
            success: true,
            sessionId: session.id,
            session: this.sanitizeSession(session)
          });
        })
        .catch(error => {
          res.status(500).json({
            error: "Import failed",
            details: error.message
          });
        });
    },

    /**
     * Import session data
     */
    importSessionData(sessionData, userId) {
      return new Promise((resolve, reject) => {
        try {
          const parsed = typeof sessionData === "string" 
            ? JSON.parse(sessionData) 
            : sessionData;

          const sessionId = this.generateSessionId();
          const session = {
            id: sessionId,
            userId: userId || parsed.userId || "imported",
            metadata: parsed.metadata || {},
            messages: parsed.messages || [],
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            imported: true
          };

          this.sessions.set(sessionId, session);

          this.logger.info(`Session imported: ${sessionId}`);

          resolve(session);
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Sanitize session for client
     */
    sanitizeSession(session) {
      return {
        id: session.id,
        userId: session.userId,
        metadata: session.metadata,
        messageCount: session.messages.length,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        imported: session.imported || false
      };
    },

    /**
     * Generate unique session ID
     */
    generateSessionId() {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Update session activity timestamp
     */
    updateSessionActivity(sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.lastActivity = new Date().toISOString();
      }
    },

    /**
     * Start session cleanup timer
     */
    startSessionCleanup() {
      setInterval(() => {
        this.cleanupInactiveSessions();
      }, 300000); // Every 5 minutes
    },

    /**
     * Clean up inactive sessions
     */
    cleanupInactiveSessions() {
      const now = Date.now();
      let cleaned = 0;

      this.sessions.forEach((session, sessionId) => {
        const lastActivity = new Date(session.lastActivity).getTime();
        const elapsed = now - lastActivity;

        if (elapsed > SESSION_TIMEOUT) {
          this.sessions.delete(sessionId);
          cleaned++;
        }
      });

      if (cleaned > 0) {
        this.logger.info(`Cleaned up ${cleaned} inactive sessions`);
      }
    },

    /**
     * Shutdown and cleanup
     */
    shutdown() {
      this.logger.info("Shutting down agent web interface");
      this.sessions.clear();
      return Promise.resolve();
    }
  };

  return AgentWebInterface;
})();

/**
 * Factory function
 */
exports.create = (FEAR) => {
  return new AgentInterface(FEAR);
};