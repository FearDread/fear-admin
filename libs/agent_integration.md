# Security Agent API Integration

## Overview

This integration adds the Security Agent functionality to your FEAR/FEARServer framework, allowing you to execute agent commands via REST API endpoints.

## Installation

1. **Place the service file:**
```bash
# Create libs directory if it doesn't exist
mkdir -p libs
cp agentService.js libs/
```

2. **Place the route file:**
```bash
# Routes are auto-loaded from the routes directory
cp agent.js routes/
```

3. **The routes will be automatically loaded** by FEAR's `setupRoutes()` method at `/fear/api/agent/*`

## API Endpoints

### Initialize Agent
```http
POST /fear/api/agent/initialize
```

**Response:**
```json
{
  "success": true,
  "message": "Agent initialized successfully",
  "modules": {
    "scanner": {
      "displayName": "Security Scanner",
      "loaded": true,
      "configured": true
    },
    "aiAnalyzer": {
      "displayName": "FEAR - AI",
      "loaded": true,
      "configured": false
    }
  }
}
```

### Execute Single Command
```http
POST /fear/api/agent/execute
Content-Type: application/json

{
  "command": "scan-ports",
  "args": ["localhost", "80,443,8080"]
}
```

**Response:**
```json
{
  "success": true,
  "command": "scan-ports localhost 80,443,8080",
  "output": "Scanning ports on localhost...\n[OPEN] Port 80\n[OPEN] Port 443",
  "errors": null
}
```

### Execute Batch Commands
```http
POST /fear/api/agent/batch
Content-Type: application/json

{
  "commands": [
    { "command": "network-info" },
    { "command": "check-deps" },
    { "command": "scan-ports", "args": ["localhost", "80,443"] }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "total": 3,
  "results": [
    {
      "success": true,
      "command": "network-info",
      "output": "Network information...",
      "index": 0
    },
    {
      "success": true,
      "command": "check-deps",
      "output": "Checking dependencies...",
      "index": 1
    },
    {
      "success": true,
      "command": "scan-ports localhost 80,443",
      "output": "Port scan results...",
      "index": 2
    }
  ]
}
```

### Get Available Commands
```http
GET /fear/api/agent/commands
```

**Response:**
```json
{
  "success": true,
  "commands": {
    "Network Scanning": [
      {
        "command": "scan-ports",
        "description": "Scan network ports",
        "module": "scanner",
        "method": "scanPorts"
      }
    ],
    "AI Features": [
      {
        "command": "ai-analyze",
        "description": "AI code analysis",
        "module": "aiAnalyzer",
        "method": "analyzeCode"
      }
    ]
  }
}
```

### Check Specific Command
```http
GET /fear/api/agent/commands/scan-ports
```

**Response:**
```json
{
  "success": true,
  "command": "scan-ports",
  "exists": true
}
```

### Get Agent Status
```http
GET /fear/api/agent/status
```

**Response:**
```json
{
  "success": true,
  "initialized": true,
  "version": {
    "agentVersion": "2.3.0",
    "nodeVersion": "v16.14.0",
    "platform": "linux",
    "architecture": "x64",
    "moduleCount": 9,
    "commandCount": 42
  },
  "modules": {
    "scanner": {
      "displayName": "Security Scanner",
      "loaded": true,
      "configured": true
    }
  }
}
```

### Get Command History
```http
GET /fear/api/agent/history?limit=20
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "index": 1,
      "command": "scan-ports localhost",
      "timestamp": "2025-10-12T10:30:00.000Z"
    }
  ]
}
```

### Get Version Info
```http
GET /fear/api/agent/version
```

**Response:**
```json
{
  "success": true,
  "agentVersion": "2.3.0",
  "nodeVersion": "v16.14.0",
  "platform": "linux",
  "architecture": "x64",
  "moduleCount": 9,
  "commandCount": 42
}
```

### Shutdown Agent
```http
POST /fear/api/agent/shutdown
```

**Response:**
```json
{
  "success": true,
  "message": "Agent shutdown successfully"
}
```

### Setup AI Configuration
```http
POST /fear/api/agent/ai/setup
Content-Type: application/json

{
  "provider": "anthropic",
  "apiKey": "your-api-key"
}
```

### Scan Network Ports
```http
POST /fear/api/agent/scan/ports
Content-Type: application/json

{
  "target": "localhost",
  "ports": "80,443,8080"
}
```

### Analyze Code
```http
POST /fear/api/agent/analyze/code
Content-Type: application/json

{
  "path": "./src/app.js",
  "type": "file"
}
```

### Search CVE Database
```http
POST /fear/api/agent/cve/search
Content-Type: application/json

{
  "query": "CVE-2024-1234"
}
```

## Usage Examples

### Node.js / JavaScript
```javascript
const axios = require('axios');

const baseURL = 'http://localhost:4000/fear/api/agent';

// Initialize agent
async function initializeAgent() {
  const response = await axios.post(`${baseURL}/initialize`);
  console.log(response.data);
}

// Execute command
async function executeCommand(command, args = []) {
  const response = await axios.post(`${baseURL}/execute`, {
    command,
    args
  });
  console.log(response.data.output);
}

// Execute batch
async function executeBatch(commands) {
  const response = await axios.post(`${baseURL}/batch`, {
    commands
  });
  console.log(response.data.results);
}

// Usage
initializeAgent();
executeCommand('scan-ports', ['localhost', '80,443']);
executeBatch([
  { command: 'network-info' },
  { command: 'security-audit' }
]);
```

### Python
```python
import requests

base_url = 'http://localhost:4000/fear/api/agent'

# Initialize agent
def initialize_agent():
    response = requests.post(f'{base_url}/initialize')
    return response.json()

# Execute command
def execute_command(command, args=None):
    data = {'command': command}
    if args:
        data['args'] = args
    response = requests.post(f'{base_url}/execute', json=data)
    return response.json()

# Execute batch
def execute_batch(commands):
    response = requests.post(f'{base_url}/batch', json={'commands': commands})
    return response.json()

# Usage
initialize_agent()
result = execute_command('scan-ports', ['localhost', '80,443'])
print(result['output'])
```

### cURL
```bash
# Initialize
curl -X POST http://localhost:4000/fear/api/agent/initialize

# Execute command
curl -X POST http://localhost:4000/fear/api/agent/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"scan-ports","args":["localhost","80,443"]}'

# Get status
curl http://localhost:4000/fear/api/agent/status

# Get commands
curl http://localhost:4000/fear/api/agent/commands
```

## Running the Agent CLI

You can still run the agent in CLI mode:

```javascript
// run-agent.js
const SecurityAgent = require('./agent');

const agent = new SecurityAgent();
agent.start();
```

```bash
node run-agent.js
```

## Integration with FEARServer

The agent routes are automatically loaded by FEAR's routing system. No additional configuration needed!

```javascript
// server.js or index.js
const FearServer = require('./FEARServer');

const server = new FearServer();

async function start() {
  await server.initialize();
  await server.startServer();
  
  // Agent API is now available at /fear/api/agent/*
  console.log('Agent API ready!');
}

start();
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Security Considerations

1. **Authentication**: Add authentication middleware to protect agent endpoints
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Command Validation**: Validate command inputs before execution
4. **Logging**: All commands are logged via FEAR's logger

### Example Authentication Middleware
```javascript
// middleware/agentAuth.js
module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.AGENT_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  next();
};

// In routes/agent.js, add to specific routes:
router.post('/execute', agentAuth, async (req, res) => {
  // ... handler code
});
```

## Advanced Features

### Webhook Notifications
```javascript
// Add to agentService.js
async executeCommandWithWebhook(command, args, webhookUrl) {
  const result = await this.executeCommand(command, args);
  
  // Send result to webhook
  await axios.post(webhookUrl, result);
  
  return result;
}
```

### Real-time Command Streaming with WebSockets

```javascript
// libs/agentWebSocket.js
const WebSocket = require('ws');
const { getInstance } = require('./agentService');

class AgentWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    
    this.wss.on('connection', (ws) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);
      
      ws.on('message', (message) => {
        this.handleMessage(clientId, ws, message);
      });
      
      ws.on('close', () => {
        this.clients.delete(clientId);
      });
      
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        message: 'Connected to Agent WebSocket'
      }));
    });
  }
  
  async handleMessage(clientId, ws, message) {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'execute') {
        const agentService = getInstance();
        
        if (!agentService.isInitialized) {
          agentService.initialize();
        }
        
        // Stream output in real-time
        const result = await this.executeWithStreaming(
          ws, 
          data.command, 
          data.args || []
        );
        
        ws.send(JSON.stringify({
          type: 'complete',
          result
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  }
  
  async executeWithStreaming(ws, command, args) {
    const agentService = getInstance();
    
    // Capture and stream console output
    const originalLog = console.log;
    console.log = (...logArgs) => {
      const output = logArgs.map(a => String(a)).join(' ');
      ws.send(JSON.stringify({
        type: 'output',
        data: output
      }));
      originalLog.apply(console, logArgs);
    };
    
    try {
      const result = await agentService.executeCommand(command, args);
      console.log = originalLog;
      return result;
    } catch (error) {
      console.log = originalLog;
      throw error;
    }
  }
  
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  broadcast(message) {
    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = AgentWebSocketServer;
```

### Add to FEARServer.js

```javascript
// Add after startHttpServer in FEARServer.js
const AgentWebSocketServer = require('./libs/agentWebSocket');

FearServer.prototype.startServer = async function() {
  try {
    const port = this.fear.getApp().get("PORT") || 4000;
    
    if (this.fear.logo) {
      this.fear.getLogger().warn(this.fear.logo);
    }

    await this.initializeDatabase();
    this.server = await this.startHttpServer(port);
    
    // Initialize WebSocket for Agent
    this.agentWss = new AgentWebSocketServer(this.server);
    this.fear.getLogger().info('Agent WebSocket initialized');
    
    this.fear.getLogger().info(`FEAR API Initialized :: Port ${port}`);
    return this.server;

  } catch (error) {
    this.fear.getLogger().error('Failed to start server:', error);
    throw error;
  }
};
```

### WebSocket Client Example

```javascript
// client-example.js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  console.log('Connected to Agent WebSocket');
  
  // Execute command
  ws.send(JSON.stringify({
    type: 'execute',
    command: 'scan-ports',
    args: ['localhost', '80,443,8080']
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  switch (message.type) {
    case 'connected':
      console.log('Client ID:', message.clientId);
      break;
    case 'output':
      console.log('Output:', message.data);
      break;
    case 'complete':
      console.log('Command completed:', message.result);
      break;
    case 'error':
      console.error('Error:', message.error);
      break;
  }
});

ws.on('close', () => {
  console.log('Disconnected from Agent WebSocket');
});
```

## Scheduled Command Execution

```javascript
// libs/agentScheduler.js
const cron = require('node-cron');
const { getInstance } = require('./agentService');

class AgentScheduler {
  constructor(logger) {
    this.logger = logger;
    this.jobs = new Map();
    this.agentService = getInstance();
  }
  
  scheduleCommand(jobId, cronExpression, command, args = []) {
    if (this.jobs.has(jobId)) {
      throw new Error(`Job ${jobId} already exists`);
    }
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        this.logger.info(`Executing scheduled job: ${jobId}`);
        
        if (!this.agentService.isInitialized) {
          this.agentService.initialize();
        }
        
        const result = await this.agentService.executeCommand(command, args);
        
        this.logger.info(`Job ${jobId} completed successfully`);
        
        // Optional: Store results or send notifications
        this.onJobComplete(jobId, result);
        
      } catch (error) {
        this.logger.error(`Job ${jobId} failed:`, error);
        this.onJobError(jobId, error);
      }
    });
    
    this.jobs.set(jobId, {
      job,
      command,
      args,
      cronExpression,
      createdAt: new Date()
    });
    
    this.logger.info(`Scheduled job ${jobId}: ${command} (${cronExpression})`);
    return true;
  }
  
  unscheduleCommand(jobId) {
    const jobInfo = this.jobs.get(jobId);
    if (!jobInfo) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    jobInfo.job.stop();
    this.jobs.delete(jobId);
    this.logger.info(`Unscheduled job: ${jobId}`);
    return true;
  }
  
  getScheduledJobs() {
    const jobs = [];
    this.jobs.forEach((jobInfo, jobId) => {
      jobs.push({
        id: jobId,
        command: jobInfo.command,
        args: jobInfo.args,
        cronExpression: jobInfo.cronExpression,
        createdAt: jobInfo.createdAt
      });
    });
    return jobs;
  }
  
  onJobComplete(jobId, result) {
    // Override this method to handle job completion
    // e.g., send webhook, save to database, etc.
  }
  
  onJobError(jobId, error) {
    // Override this method to handle job errors
    // e.g., send alerts, log to monitoring service, etc.
  }
  
  stopAll() {
    this.jobs.forEach((jobInfo, jobId) => {
      jobInfo.job.stop();
    });
    this.jobs.clear();
    this.logger.info('All scheduled jobs stopped');
  }
}

module.exports = AgentScheduler;
```

### Scheduler API Routes

```javascript
// Add to routes/agent.js

/**
 * @route POST /fear/api/agent/schedule
 * @desc Schedule a command for periodic execution
 * @access Public
 */
router.post('/schedule', async (req, res) => {
  try {
    const { jobId, cronExpression, command, args } = req.body;

    if (!jobId || !cronExpression || !command) {
      return handler.error(res, 'Job ID, cron expression, and command are required', 400);
    }

    // Initialize scheduler if not exists
    if (!global.agentScheduler) {
      const AgentScheduler = require('../libs/agentScheduler');
      global.agentScheduler = new AgentScheduler(logger);
    }

    global.agentScheduler.scheduleCommand(
      jobId,
      cronExpression,
      command,
      args || []
    );

    logger.info(`Scheduled job: ${jobId}`);
    return handler.success(res, {
      success: true,
      message: 'Job scheduled successfully',
      jobId,
      cronExpression,
      command
    });

  } catch (error) {
    logger.error('Job scheduling error:', error);
    return handler.error(res, error.message || 'Failed to schedule job', 500);
  }
});

/**
 * @route DELETE /fear/api/agent/schedule/:jobId
 * @desc Unschedule a job
 * @access Public
 */
router.delete('/schedule/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!global.agentScheduler) {
      return handler.error(res, 'No scheduler initialized', 400);
    }

    global.agentScheduler.unscheduleCommand(jobId);

    logger.info(`Unscheduled job: ${jobId}`);
    return handler.success(res, {
      success: true,
      message: 'Job unscheduled successfully',
      jobId
    });

  } catch (error) {
    logger.error('Job unscheduling error:', error);
    return handler.error(res, error.message || 'Failed to unschedule job', 500);
  }
});

/**
 * @route GET /fear/api/agent/schedule
 * @desc Get all scheduled jobs
 * @access Public
 */
router.get('/schedule', async (req, res) => {
  try {
    if (!global.agentScheduler) {
      return handler.success(res, {
        success: true,
        jobs: []
      });
    }

    const jobs = global.agentScheduler.getScheduledJobs();

    return handler.success(res, {
      success: true,
      jobs
    });

  } catch (error) {
    logger.error('Error fetching scheduled jobs:', error);
    return handler.error(res, 'Failed to fetch scheduled jobs', 500);
  }
});
```

### Schedule Command Examples

```bash
# Schedule daily security audit at 2 AM
curl -X POST http://localhost:4000/fear/api/agent/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "daily-security-audit",
    "cronExpression": "0 2 * * *",
    "command": "security-audit"
  }'

# Schedule hourly dependency check
curl -X POST http://localhost:4000/fear/api/agent/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "hourly-deps-check",
    "cronExpression": "0 * * * *",
    "command": "check-deps"
  }'

# Schedule CVE scan every 6 hours
curl -X POST http://localhost:4000/fear/api/agent/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "cve-scan",
    "cronExpression": "0 */6 * * *",
    "command": "scan-deps"
  }'

# Get all scheduled jobs
curl http://localhost:4000/fear/api/agent/schedule

# Unschedule a job
curl -X DELETE http://localhost:4000/fear/api/agent/schedule/daily-security-audit
```

## Complete Integration Example

```javascript
// server.js - Complete setup
const FearServer = require('./FEARServer');
const AgentScheduler = require('./libs/agentScheduler');

async function main() {
  const server = new FearServer();
  
  try {
    // Initialize FEAR
    await server.initialize();
    
    // Start the server
    await server.startServer();
    
    const logger = server.getLogger();
    logger.info('FEAR Server with Agent API is running');
    
    // Initialize agent scheduler
    global.agentScheduler = new AgentScheduler(logger);
    
    // Schedule default jobs
    global.agentScheduler.scheduleCommand(
      'daily-audit',
      '0 2 * * *',
      'security-audit'
    );
    
    logger.info('Agent scheduler initialized with default jobs');
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  if (global.agentScheduler) {
    global.agentScheduler.stopAll();
  }
  
  process.exit(0);
});

main();
```

## Testing Suite

```javascript
// test/agent-api.test.js
const axios = require('axios');
const assert = require('assert');

const baseURL = 'http://localhost:4000/fear/api/agent';
const client = axios.create({ baseURL });

describe('Agent API Tests', () => {
  
  it('should initialize agent', async () => {
    const res = await client.post('/initialize');
    assert.strictEqual(res.data.success, true);
    assert(res.data.modules);
  });
  
  it('should execute single command', async () => {
    const res = await client.post('/execute', {
      command: 'version'
    });
    assert.strictEqual(res.data.success, true);
    assert(res.data.output);
  });
  
  it('should execute batch commands', async () => {
    const res = await client.post('/batch', {
      commands: [
        { command: 'version' },
        { command: 'status' }
      ]
    });
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 2);
    assert.strictEqual(res.data.results.length, 2);
  });
  
  it('should get available commands', async () => {
    const res = await client.get('/commands');
    assert.strictEqual(res.data.success, true);
    assert(res.data.commands);
  });
  
  it('should get agent status', async () => {
    const res = await client.get('/status');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.initialized, true);
  });
  
  it('should schedule a job', async () => {
    const res = await client.post('/schedule', {
      jobId: 'test-job',
      cronExpression: '0 0 * * *',
      command: 'version'
    });
    assert.strictEqual(res.data.success, true);
  });
  
  it('should get scheduled jobs', async () => {
    const res = await client.get('/schedule');
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.jobs));
  });
  
  it('should unschedule a job', async () => {
    const res = await client.delete('/schedule/test-job');
    assert.strictEqual(res.data.success, true);
  });
});
```

Run tests:
```bash
npm test
```

## Environment Variables

Add to your `.env` file:

```env
# Agent Configuration
AGENT_ENABLED=true
AGENT_API_KEY=your-secure-api-key
AGENT_WEBSOCKET_ENABLED=true

# AI Configuration (optional)
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Scheduler Configuration
AGENT_SCHEDULER_ENABLED=true
AGENT_DEFAULT_JOBS=daily-audit,hourly-deps-check
```

## Production Deployment Checklist

- [ ] Set `AGENT_API_KEY` for authentication
- [ ] Enable rate limiting on agent endpoints
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and alerting
- [ ] Enable request logging
- [ ] Configure job result persistence
- [ ] Set up backup for scheduled jobs
- [ ] Enable HTTPS/WSS for production
- [ ] Configure firewall rules
- [ ] Set up log rotation

## Troubleshooting

### Agent not initializing
```javascript
// Check module loading
GET /fear/api/agent/status
```

### Commands failing
```javascript
// Check if command exists
GET /fear/api/agent/commands/your-command

// Check command history for errors
GET /fear/api/agent/history
```

### WebSocket connection issues
```javascript
// Verify WebSocket server is running
// Check firewall settings
// Ensure proper protocol (ws:// vs wss://)
```

## Summary

You now have a complete integration of the Security Agent with your FEAR/FEARServer framework, including:

✅ REST API endpoints for all agent commands
✅ Batch command execution
✅ WebSocket support for real-time streaming
✅ Scheduled command execution with cron
✅ Comprehensive error handling
✅ Logging and monitoring
✅ Testing suite
✅ Production-ready configuration

The agent can be used both as a CLI tool and via API, providing maximum flexibility for your security testing needs!