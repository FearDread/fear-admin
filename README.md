# FEAR API

A Node.js Express-based REST API framework with built-in middleware, logging, database integration, and cloud services support.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Structure](#api-structure)
- [Authentication & CORS](#authentication--cors)
- [Route Configuration](#route-configuration)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Development](#development)
- [Support](#support)

## Overview

FEAR is a robust Express.js API framework that provides a structured foundation for building scalable REST APIs. It includes built-in middleware for logging, compression, file uploads, CORS handling, and graceful shutdown capabilities.

**Key Components:**
- Express.js server with automatic route loading
- Integrated logging system with Morgan
- Database abstraction layer
- Cloud services integration
- File upload support
- CORS configuration
- Environment-based configuration
- Graceful shutdown handling

## Features

- ✅ **Auto Route Loading** - Automatically discovers and loads routes from `/routes` directory
- ✅ **Built-in Middleware** - Compression, file upload, cookie parsing, JSON parsing
- ✅ **Logging System** - Integrated Winston/Morgan logging
- ✅ **Database Integration** - Abstract database layer with connection management
- ✅ **Cloud Services** - Built-in cloud service integrations
- ✅ **CORS Support** - Configurable cross-origin resource sharing
- ✅ **Environment Config** - .env file configuration management
- ✅ **Graceful Shutdown** - Proper cleanup on process termination
- ✅ **Static File Serving** - SPA support with React build serving
- ✅ **Error Handling** - Comprehensive error logging and handling

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Database system (as configured)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fear-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the server**
```bash
npm start
# or for development
npm run dev
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_PORT=4000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fear_db
DB_USER=your_username
DB_PASSWORD=your_password

# Cloud Services (optional)
CLOUD_API_KEY=your_cloud_api_key

# Branding
FEAR_LOGO=
 _____ _____    _    ____  
|  ___| ____|  / \  |  _ \ 
| |_  |  _|   / _ \ | |_) |
|  _| | |___ / ___ \|  _ < 
|_|   |_____/_/   \_\_| \_\
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_PORT` | Server port number | No (default: 4000) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | Yes |
| `DB_*` | Database connection parameters | Yes |
| `FEAR_LOGO` | ASCII logo for startup | No |

## API Structure

### Base URL Structure

```
https://your-domain.com/fear/api/{route}
```

### Route Auto-Loading

Routes are automatically loaded from the `/routes` directory. Each `.js` file becomes an available endpoint:

```
routes/
├── users.js      → /fear/api/users
├── auth.js       → /fear/api/auth
├── products.js   → /fear/api/products
└── admin.js      → /fear/api/admin
```

### Creating Routes

Create route files in the `/routes` directory:

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// GET /fear/api/users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

// GET /fear/api/users/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user ${id}` });
});

// POST /fear/api/users
router.post('/', (req, res) => {
  const userData = req.body;
  res.json({ message: 'User created', data: userData });
});

module.exports = router;
```

## Authentication & CORS

### CORS Configuration

CORS is configured per route based on the `ALLOWED_ORIGINS` environment variable:

```javascript
// Automatically applied to all routes
const corsConfig = {
  credentials: true,
  origin: (origin, callback) => {
    // Allows configured origins + requests with no origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
```

### Request Headers

Standard headers are automatically parsed:
- `Content-Type: application/json`
- `Cookie` headers (via cookie-parser)
- File uploads (via express-fileupload)

## Request/Response Examples

### Standard API Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    // Your data here
  },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Example Requests

**GET Request:**
```bash
curl -X GET "http://localhost:4000/fear/api/users" \
  -H "Content-Type: application/json"
```

**POST Request with JSON:**
```bash
curl -X POST "http://localhost:4000/fear/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**File Upload:**
```bash
curl -X POST "http://localhost:4000/fear/api/upload" \
  -F "file=@document.pdf" \
  -F "category=documents"
```

## Error Handling

### Built-in Error Logging

All requests are automatically logged:
```
INFO: FEAR API Query :: /fear/api/users
ERROR: Origin :: http://unauthorized-domain.com :: Not allowed by CORS
```

### Graceful Shutdown

The server handles shutdown signals gracefully:
- `SIGTERM` - Graceful shutdown
- `SIGINT` - Interrupt signal (Ctrl+C)
- `unhandledRejection` - Promise rejection handling
- `uncaughtException` - Exception handling

### Database Connection Management

Database connections are properly closed during shutdown to prevent connection leaks.

## Deployment

### Production Build

1. **Set production environment**
```bash
NODE_ENV=production
```

2. **Build frontend assets** (if using integrated React app)
```bash
cd frontend
npm run build
```

3. **Start production server**
```bash
npm start
```

### Docker Deployment

```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 4000

CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
NODE_PORT=4000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
# ... other production configs
```

## Development

### Development Server

```bash
# Start with auto-reload
npm run dev

# Start with debugging
DEBUG=* npm start
```

### Project Structure

```
fear-api/
├── FEAR.js                 # Main application class
├── FearServer.js          # Server initialization and process management
├── routes/                # API route definitions
│   ├── users.js
│   ├── auth.js
│   └── ...
├── libs/                  # Internal libraries
│   ├── logger/           # Logging utilities
│   ├── cloud/            # Cloud service integrations
│   └── db/               # Database abstraction
├── backend/dashboard/build/  # Frontend build (if integrated)
├── .env                   # Environment configuration
└── package.json
```

### API Access

The FEAR instance provides access to core components:

```javascript
const fear = createFearApp();

// Access Express app
const app = fear.getApp();

// Access logger
const logger = fear.getLogger();

// Access database
const db = fear.getDatabase();

// Access environment config
const env = fear.getEnvironment();

// Access cloud services
const cloud = fear.getCloud();
```

### Adding Middleware

Add custom middleware in route files or modify the main FEAR class:

```javascript
// In route file
router.use((req, res, next) => {
  // Custom middleware logic
  next();
});

// Or globally in FEAR.js setupMiddleware()
```

## Monitoring & Logging

### Request Logging

All API requests are automatically logged with:
- Request URL
- Timestamp
- User information (if available)

### Error Logging

Errors are logged with full stack traces and context information.

### Health Check

Create a health check endpoint:

```javascript
// routes/health.js
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Support

- **Documentation**: Check inline code comments and JSDoc
- **Issues**: Report bugs and feature requests on your issue tracker
- **Logs**: Check application logs for debugging information

## License

[Your License Here]

---

**API Base URL**: `http://localhost:4000/fear/api/`  
**Health Check**: `GET /fear/api/health`