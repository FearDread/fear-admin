// routes/agent.js - API routes for Security Agent (Updated)
const agentController = require('../controllers/agent');

module.exports = (fear) => {
  const router = fear.createRouter();
  const logger = fear.getLogger();
  const handler = fear.getHandler();
  const validator = fear.getValidator();

  /**
   * @route POST /fear/api/agent/initialize
   * @desc Initialize the security agent
   * @access Public
   */
  router.post('/initialize', async (req, res) => {
    return agentController.initialize(req, res, handler, logger);
  });

  /**
   * @route POST /fear/api/agent/execute
   * @desc Execute a single command
   * @access Public
   */
  router.post('/execute', async (req, res) => {
    return agentController.executeCommand(req, res, handler, logger);
  });

  /**
   * @route POST /fear/api/agent/batch
   * @desc Execute multiple commands in sequence
   * @access Public
   */
  router.post('/batch', async (req, res) => {
    return agentController.executeBatch(req, res, handler, logger);
  });

  /**
   * @route GET /fear/api/agent/commands
   * @desc Get all available commands
   * @access Public
   */
  router.get('/commands', async (req, res) => {
    return agentController.getCommands(req, res, handler, logger);
  });

  /**
   * @route GET /fear/api/agent/commands/:command
   * @desc Check if a specific command exists
   * @access Public
   */
  router.get('/commands/:command', async (req, res) => {
    return agentController.checkCommand(req, res, handler, logger);
  });

  /**
   * @route GET /fear/api/agent/status
   * @desc Get agent and module status
   * @access Public
   */
  router.get('/status', async (req, res) => {
    return agentController.getStatus(req, res, handler, logger);
  });

  /**
   * @route GET /fear/api/agent/history
   * @desc Get command history
   * @access Public
   */
  router.get('/history', async (req, res) => {
    return agentController.getHistory(req, res, handler, logger);
  });

  /**
   * @route GET /fear/api/agent/version
   * @desc Get agent version information
   * @access Public
   */
  router.get('/version', async (req, res) => {
    return agentController.getVersion(req, res, handler, logger);
  });

  /**
   * @route POST /fear/api/agent/shutdown
   * @desc Shutdown the agent
   * @access Public
   */
  router.post('/shutdown', async (req, res) => {
    return agentController.shutdown(req, res, handler, logger);
  });

  // ============================================
  // MODULE-SPECIFIC ROUTES
  // ============================================

  /**
   * @route POST /fear/api/agent/ai/setup
   * @desc Setup AI configuration
   * @access Public
   */
  router.post('/ai/setup', async (req, res) => {
    try {
      const { provider, apiKey } = req.body;

      if (!provider || !apiKey) {
        return handler.error(res, 'Provider and API key are required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'ai-setup', args: [provider, apiKey] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('AI setup error:', error);
      return handler.error(res, error.message || 'AI setup failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/ai/provider
   * @desc Switch AI provider
   * @access Public
   */
  router.post('/ai/provider', async (req, res) => {
    try {
      const { provider } = req.body;

      if (!provider) {
        return handler.error(res, 'Provider is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'ai-provider', args: [provider] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('AI provider switch error:', error);
      return handler.error(res, error.message || 'Provider switch failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/ai/status
   * @desc Get AI module status
   * @access Public
   */
  router.get('/ai/status', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'ai-status', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/scan/ports
   * @desc Scan network ports
   * @access Public
   */
  router.post('/scan/ports', async (req, res) => {
    try {
      const { target, ports } = req.body;

      if (!target) {
        return handler.error(res, 'Target is required', 400);
      }

      const args = ports ? [target, ports] : [target];
      
      const result = await agentController.executeCommand(
        { body: { command: 'scan-ports', args } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Port scan error:', error);
      return handler.error(res, error.message || 'Port scan failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/analyze/code
   * @desc Analyze code file or project
   * @access Public
   */
  router.post('/analyze/code', async (req, res) => {
    try {
      const { path, type } = req.body;

      if (!path) {
        return handler.error(res, 'Path is required', 400);
      }

      const command = type === 'project' ? 'analyze-project' : 'analyze-code';
      
      const result = await agentController.executeCommand(
        { body: { command, args: [path] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Code analysis error:', error);
      return handler.error(res, error.message || 'Code analysis failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/cve/search
   * @desc Search CVE database
   * @access Public
   */
  router.post('/cve/search', async (req, res) => {
    try {
      const { query } = req.body;

      if (!query) {
        return handler.error(res, 'Search query is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'search-cve', args: [query] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('CVE search error:', error);
      return handler.error(res, error.message || 'CVE search failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/chat
   * @desc Start or send message to AI chat session
   * @access Public
   */
  router.post('/chat', async (req, res) => {
    try {
      const { message, sessionId } = req.body;

      if (!message) {
        return handler.error(res, 'Message is required', 400);
      }

      const args = sessionId ? [message, sessionId] : [message];
      
      const result = await agentController.executeCommand(
        { body: { command: 'chat-quick', args } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Chat error:', error);
      return handler.error(res, error.message || 'Chat failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/chat/history
   * @desc Get chat history
   * @access Public
   */
  router.get('/chat/history', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'chat-history', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/chat/clear
   * @desc Clear chat history
   * @access Public
   */
  router.post('/chat/clear', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'chat-clear', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/service/start
   * @desc Start a background service
   * @access Public
   */
  router.post('/service/start', async (req, res) => {
    try {
      const { service } = req.body;

      if (!service) {
        return handler.error(res, 'Service name is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'service-start', args: [service] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Service start error:', error);
      return handler.error(res, error.message || 'Service start failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/service/stop
   * @desc Stop a background service
   * @access Public
   */
  router.post('/service/stop', async (req, res) => {
    try {
      const { service } = req.body;

      if (!service) {
        return handler.error(res, 'Service name is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'service-stop', args: [service] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Service stop error:', error);
      return handler.error(res, error.message || 'Service stop failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/service/status
   * @desc Get status of all services
   * @access Public
   */
  router.get('/service/status', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'service-status', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route GET /fear/api/agent/service/list
   * @desc List all available services
   * @access Public
   */
  router.get('/service/list', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'service-list', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/proxy/configure
   * @desc Configure proxy settings
   * @access Public
   */
  router.post('/proxy/configure', async (req, res) => {
    try {
      const { provider, apiKey, username, password } = req.body;

      if (!provider) {
        return handler.error(res, 'Provider is required', 400);
      }

      let command, args;
      
      if (provider === 'proxifly') {
        if (!apiKey) {
          return handler.error(res, 'API key is required for Proxifly', 400);
        }
        command = 'configure-proxifly';
        args = [apiKey];
      } else if (provider === 'proxy5') {
        if (!username || !password) {
          return handler.error(res, 'Username and password are required for Proxy5', 400);
        }
        command = 'configure-proxy5';
        args = [username, password];
      } else {
        return handler.error(res, 'Invalid provider. Use "proxifly" or "proxy5"', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command, args } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Proxy configuration error:', error);
      return handler.error(res, error.message || 'Proxy configuration failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/proxy/list
   * @desc List available proxies
   * @access Public
   */
  router.get('/proxy/list', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'list-proxies', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/proxy/select
   * @desc Select and activate a proxy
   * @access Public
   */
  router.post('/proxy/select', async (req, res) => {
    try {
      const { proxyId } = req.body;

      if (!proxyId) {
        return handler.error(res, 'Proxy ID is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'select-proxy', args: [proxyId] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Proxy selection error:', error);
      return handler.error(res, error.message || 'Proxy selection failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/proxy/status
   * @desc Get current proxy status
   * @access Public
   */
  router.get('/proxy/status', async (req, res) => {
    return agentController.executeCommand(
      { body: { command: 'proxy-status', args: [] } },
      res,
      handler,
      logger
    );
  });

  /**
   * @route POST /fear/api/agent/card/validate
   * @desc Validate credit card number
   * @access Public
   */
  router.post('/card/validate', async (req, res) => {
    try {
      const { cardNumber } = req.body;

      if (!cardNumber) {
        return handler.error(res, 'Card number is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'validate-card', args: [cardNumber] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Card validation error:', error);
      return handler.error(res, error.message || 'Card validation failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/card/check-status
   * @desc Check card payment status
   * @access Public
   */
  router.post('/card/check-status', async (req, res) => {
    try {
      const { cardNumber, expiry, cvv } = req.body;

      if (!cardNumber) {
        return handler.error(res, 'Card number is required', 400);
      }

      const args = [cardNumber];
      if (expiry) args.push(expiry);
      if (cvv) args.push(cvv);

      const result = await agentController.executeCommand(
        { body: { command: 'check-card-status', args } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Card status check error:', error);
      return handler.error(res, error.message || 'Card status check failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/crypto/price
   * @desc Get cryptocurrency price
   * @access Public
   */
  router.get('/crypto/price/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;

      if (!symbol) {
        return handler.error(res, 'Cryptocurrency symbol is required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'crypto-price', args: [symbol] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Crypto price error:', error);
      return handler.error(res, error.message || 'Crypto price fetch failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/crypto/convert
   * @desc Convert between cryptocurrencies
   * @access Public
   */
  router.post('/crypto/convert', async (req, res) => {
    try {
      const { from, to, amount } = req.body;

      if (!from || !to || !amount) {
        return handler.error(res, 'From, to, and amount are required', 400);
      }

      const result = await agentController.executeCommand(
        { body: { command: 'crypto-convert', args: [from, to, amount] } },
        res,
        handler,
        logger
      );

      return result;

    } catch (error) {
      logger.error('Crypto conversion error:', error);
      return handler.error(res, error.message || 'Crypto conversion failed', 500);
    }
  });

  return router;
};
