// routes/agent.js - API routes for Security Agent
const Agent = require('../libs/agent');

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
      const agentService = router.getAiAgent();
      const result = agentService.initialize();
      console.log('agent result = ', result);

      if (result.success) {
        logger.info('Agent initialized via API');
        return handler.success(req, result);

      } else {
        logger.error('Agent initialization failed:', result.error);
        return handler.error(res, result.message, 500);
      }

      logger.error('Agent initialization error:', error);
      return handler.error(res, 'Failed to initialize agent', 500);

  });

  /**
   * @route POST /fear/api/agent/execute
   * @desc Execute a single command
   * @access Public
   */
  router.post('/execute', async (req, res) => {
    try {
      const { command, args } = req.body;

      if (!command) {
        return handler.error(res, 'Command is required', 400);
      }

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const result = await agentService.executeCommand(
        command, 
        Array.isArray(args) ? args : (args ? [args] : [])
      );

      logger.info(`Agent command executed: ${command}`);
      return handler.success(res, result);

    } catch (error) {
      logger.error('Agent command execution error:', error);
      return handler.error(res, error.message || 'Command execution failed', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/batch
   * @desc Execute multiple commands in sequence
   * @access Public
   */
  router.post('/batch', async (req, res) => {
    try {
      const { commands } = req.body;

      if (!Array.isArray(commands) || commands.length === 0) {
        return handler.error(res, 'Commands array is required', 400);
      }

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const result = await agentService.executeBatch(commands);

      logger.info(`Agent batch execution: ${commands.length} commands`);
      return handler.success(res, result);

    } catch (error) {
      logger.error('Agent batch execution error:', error);
      return handler.error(res, error.message || 'Batch execution failed', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/commands
   * @desc Get all available commands
   * @access Public
   */
  router.get('/commands', async (req, res) => {
    try {
      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const commands = agentService.getAvailableCommands();

      return handler.success(res, {
        success: true,
        commands
      });

    } catch (error) {
      logger.error('Error fetching commands:', error);
      return handler.error(res, 'Failed to fetch commands', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/commands/:command
   * @desc Check if a specific command exists
   * @access Public
   */
  router.get('/commands/:command', async (req, res) => {
    try {
      const { command } = req.params;
      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const exists = agentService.commandExists(command);

      return handler.success(res, {
        success: true,
        command,
        exists
      });

    } catch (error) {
      logger.error('Error checking command:', error);
      return handler.error(res, 'Failed to check command', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/status
   * @desc Get agent and module status
   * @access Public
   */
  router.get('/status', async (req, res) => {
    try {
      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        return handler.success(res, {
          success: true,
          initialized: false,
          message: 'Agent not initialized'
        });
      }

      const modules = agentService.getModuleStatus();
      const version = agentService.getVersionInfo();

      return handler.success(res, {
        success: true,
        initialized: true,
        version,
        modules
      });

    } catch (error) {
      logger.error('Error fetching agent status:', error);
      return handler.error(res, 'Failed to fetch status', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/history
   * @desc Get command history
   * @access Public
   */
  router.get('/history', async (req, res) => {
    try {
      const { limit } = req.query;
      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        return handler.success(res, {
          success: true,
          history: [],
          message: 'Agent not initialized'
        });
      }

      const history = agentService.getCommandHistory(
        limit ? parseInt(limit) : 20
      );

      return handler.success(res, {
        success: true,
        history
      });

    } catch (error) {
      logger.error('Error fetching history:', error);
      return handler.error(res, 'Failed to fetch history', 500);
    }
  });

  /**
   * @route GET /fear/api/agent/version
   * @desc Get agent version information
   * @access Public
   */
  router.get('/version', async (req, res) => {
    try {
      const agentService = getInstance();
      const version = agentService.getVersionInfo();

      return handler.success(res, {
        success: true,
        ...version
      });

    } catch (error) {
      logger.error('Error fetching version:', error);
      return handler.error(res, 'Failed to fetch version', 500);
    }
  });

  /**
   * @route POST /fear/api/agent/shutdown
   * @desc Shutdown the agent
   * @access Public
   */
  router.post('/shutdown', async (req, res) => {
    try {
      const agentService = getInstance();
      const result = agentService.shutdown();

      if (result.success) {
        logger.info('Agent shutdown via API');
        return handler.success(res, result);
      } else {
        return handler.error(res, result.message, 500);
      }

    } catch (error) {
      logger.error('Agent shutdown error:', error);
      return handler.error(res, 'Failed to shutdown agent', 500);
    }
  });

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

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const result = await agentService.executeCommand('ai-setup', [provider, apiKey]);

      logger.info(`AI provider configured: ${provider}`);
      return handler.success(res, result);

    } catch (error) {
      logger.error('AI setup error:', error);
      return handler.error(res, error.message || 'AI setup failed', 500);
    }
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

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const args = ports ? [target, ports] : [target];
      const result = await agentService.executeCommand('scan-ports', args);

      logger.info(`Port scan executed: ${target}`);
      return handler.success(res, result);

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

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const command = type === 'project' ? 'analyze-project' : 'analyze-code';
      const result = await agentService.executeCommand(command, [path]);

      logger.info(`Code analysis executed: ${path}`);
      return handler.success(res, result);

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

      const agentService = getInstance();
      
      if (!agentService.isInitialized) {
        agentService.initialize();
      }

      const result = await agentService.executeCommand('search-cve', [query]);

      logger.info(`CVE search executed: ${query}`);
      return handler.success(res, result);

    } catch (error) {
      logger.error('CVE search error:', error);
      return handler.error(res, error.message || 'CVE search failed', 500);
    }
  });

  return router;
};
