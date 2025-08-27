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
# or run directly
node index.js
```

### Application Entry Point

The main entry point initializes the FEAR server:

```javascript
// index.js
const FearServer = require("./src/FEARServer");

async function main() {
  const server = new FearServer();
  
  try {
    await server.initialize();
    await server.startServer();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle top-level errors
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
```

This provides robust error handling and ensures the application starts up correctly with proper initialization sequence.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_PORT=4000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/fear_db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fear_db

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Application Branding
FEAR_LOGO="
 _____ _____    _    ____  
|  ___| ____|  / \  |  _ \ 
| |_  |  _|   / _ \ | |_) |
|  _| | |___ / ___ \|  _ < 
|_|   |_____/_/   \_\_| \_\
"
```

### Required Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_PORT` | Server port number | No | 4000 |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins for CORS | Yes | - |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `CLOUDINARY_NAME` | Cloudinary cloud name | Yes (for images) | - |
| `API_KEY` | Cloudinary API key | Yes (for images) | - |
| `API_SECRET` | Cloudinary API secret | Yes (for images) | - |
| `FEAR_LOGO` | ASCII logo displayed on startup | No | - |

### Cloudinary Setup

1. **Create Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Get Credentials**: Find your cloud name, API key, and secret in the dashboard
3. **Configure Upload Presets**: Set up upload folders (`avatar`, `products`) if needed

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
sudo apt-get install mongodb                 # Ubuntu

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
sudo systemctl start mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/fear_db
```

**MongoDB Atlas (Cloud):**
```bash
# Create cluster at mongodb.com/atlas
# Get connection string from Atlas dashboard
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fear_db?retryWrites=true&w=majority
```

## API Structure

### Base URL Structure

```
https://your-domain.com/fear/api/{route}
```

### MongoDB & Mongoose Integration

The API uses MongoDB with Mongoose ODM and provides built-in CRUD operations for all models.

### Generic CRUD Controller

FEAR includes a powerful generic CRUD controller that works with any Mongoose model:

```javascript
// Example route using CRUD controller
const express = require('express');
const router = express.Router();
const { crudController } = require('../libs/controller/crud');
const UserModel = require('../models/User');

// Create controller instance for User model
const userController = crudController(UserModel);

// Standard CRUD endpoints
router.get('/', userController.list);           // GET /fear/api/users (paginated)
router.get('/all', userController.all);        // GET /fear/api/users/all
router.get('/search', userController.search);  // GET /fear/api/users/search
router.get('/:id', userController.read);       // GET /fear/api/users/:id
router.post('/', userController.create);       // POST /fear/api/users
router.put('/:id', userController.update);     // PUT /fear/api/users/:id
router.delete('/:id', userController.delete);  // DELETE /fear/api/users/:id

module.exports = router;
```

### Route Auto-Loading

Routes are automatically loaded from the `/routes` directory:

```
routes/
├── users.js      → /fear/api/users
├── products.js   → /fear/api/products
├── categories.js → /fear/api/categories
└── uploads.js    → /fear/api/uploads
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

## CRUD Operations

### Available Endpoints for Each Resource

All resources automatically get these endpoints when using the CRUD controller:

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/{resource}` | Get paginated list | `page`, `limit`, `sort`, `order`, `populate` |
| GET | `/{resource}/all` | Get all records | `sort`, `order`, `populate` |
| GET | `/{resource}/search` | Advanced search | `keyword`, `limit`, `sort`, `fields`, `populate` |
| GET | `/{resource}/{id}` | Get single record | `populate` |
| POST | `/{resource}` | Create new record | - |
| PUT | `/{resource}/{id}` | Update record | - |
| DELETE | `/{resource}/{id}` | Delete record | - |

### Advanced Search & Filtering

The search endpoint supports powerful query capabilities:

```bash
# Text search with keyword
GET /fear/api/products/search?keyword=laptop&limit=10

# Filter by exact match
GET /fear/api/products?category=electronics&status=active

# Range queries
GET /fear/api/products?price[gte]=100&price[lte]=500

# Array filtering
GET /fear/api/products?tags[in]=popular,featured

# Sorting and pagination
GET /fear/api/products?sort=createdAt&order=desc&page=2&limit=20

# Field selection
GET /fear/api/products?fields=name,price,category

# Population control
GET /fear/api/products?populate=category,reviews
```

### Cloud Image Integration

FEAR includes built-in Cloudinary integration for image handling:

```javascript
// Images are automatically processed during create/update operations
POST /fear/api/products
{
  "name": "Product Name",
  "description": "Product description",
  "images": ["data:image/jpeg;base64,/9j/4AAQSkZJR..."] // Base64 images
}

// Response includes processed image URLs
{
  "success": true,
  "result": {
    "_id": "64a7b8c9d1234567890abcdef",
    "name": "Product Name",
    "images": [
      {
        "product_id": "products/abc123",
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/products/abc123.jpg"
      }
    ]
  },
  "message": "Document created successfully"
}
```

## Request/Response Examples

### Standard API Response Format

All CRUD operations return consistent response format:

```javascript
// Success Response
{
  "success": true,
  "result": {}, // or [] for arrays
  "message": "Operation completed successfully",
  "count": 1 // for list operations
}

// Paginated Response
{
  "success": true,
  "result": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Found 10 of 50 documents"
}

// Search Response with Metadata
{
  "success": true,
  "result": [],
  "meta": {
    "total": 25,
    "count": 10,
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalDocuments": 25,
      "hasNextPage": true
    },
    "query": { "keyword": "laptop" }
  },
  "message": "Found 10 matching documents"
}

// Error Response
{
  "success": false,
  "result": null,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Example API Requests

**Get All Documents (Paginated):**
```bash
curl -X GET "http://localhost:4000/fear/api/products" \
  -H "Content-Type: application/json"
```

**Advanced Search:**
```bash
curl -X GET "http://localhost:4000/fear/api/products/search?keyword=laptop&limit=5" \
  -H "Content-Type: application/json"
```

**Create Document with Images:**
```bash
curl -X POST "http://localhost:4000/fear/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "category": "electronics",
    "price": 1299.99,
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJR..."]
  }'
```

**Update Document:**
```bash
curl -X PUT "http://localhost:4000/fear/api/products/64a7b8c9d1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"price": 1199.99, "status": "sale"}'
```

**Get Single Document with Population:**
```bash
curl -X GET "http://localhost:4000/fear/api/products/64a7b8c9d1234567890abcdef?populate=true" \
  -H "Content-Type: application/json"
```

**Complex Filter Query:**
```bash
curl -X GET "http://localhost:4000/fear/api/products?category=electronics&price[gte]=500&price[lte]=2000&sort=price&order=asc" \
  -H "Content-Type: application/json"
```

## Error Handling

### HTTP Status Codes

The API uses standard HTTP status codes with detailed error messages:

- `200` - OK: Request successful
- `201` - Created: Resource created successfully  
- `400` - Bad Request: Invalid request parameters or validation failed
- `404` - Not Found: Resource not found
- `409` - Conflict: Duplicate unique field values
- `500` - Internal Server Error: Server error

### Error Response Examples

**Validation Error:**
```json
{
  "success": false,
  "result": null,
  "message": "Validation failed: Required fields are missing or invalid",
  "errors": {
    "name": {
      "message": "Name is required",
      "kind": "required",
      "path": "name"
    },
    "email": {
      "message": "Please provide a valid email",
      "kind": "regexp",
      "path": "email"
    }
  }
}
```

**Not Found Error:**
```json
{
  "success": false,
  "result": null,
  "message": "Document with ID 64a7b8c9d1234567890abcdef not found"
}
```

**Duplicate Key Error:**
```json
{
  "success": false,
  "result": null,
  "message": "Document already exists with provided unique fields",
  "error": "E11000 duplicate key error collection..."
}
```

**CORS Error:**
```json
{
  "success": false,
  "result": null,
  "message": "Not allowed by CORS"
}
```

### ObjectId Validation

All ID parameters are automatically validated:
- Must be 24-character hexadecimal string
- Invalid IDs return `400 Bad Request`
- Missing IDs return `400 Bad Request`

### Image Upload Errors

Image processing errors are handled gracefully:
- Unsupported formats return validation errors
- Upload failures are logged and return server errors
- Partial upload failures are handled per-image

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

### Project Structure

```
fear-api/
├── index.js                 # Main entry point
├── src/
│   ├── FEAR.js              # Main application class
│   └── FEARServer.js        # Server initialization and process management  
├── routes/                  # API route definitions
│   ├── users.js
│   ├── products.js
│   └── categories.js
├── libs/
│   ├── controller/
│   │   └── crud.js          # Generic CRUD operations
│   ├── features/
│   │   └── api.js           # Advanced search features
│   ├── cloud/
│   │   └── index.js         # Cloudinary integration
│   ├── logger/              # Winston/Morgan logging
│   └── db/                  # Database abstraction layer
├── models/                  # Mongoose schema definitions
├── middleware/              # Custom Express middleware
├── public/images/           # Local image storage (if used)
├── .env                     # Environment configuration
└── package.json
```

### Creating Models

Define Mongoose schemas for your data:

```javascript
// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    product_id: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'sale'],
    default: 'active'
  },
  tags: [String]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add text search index
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Product', productSchema);
```

### Using the CRUD Controller

Routes become very simple with the generic controller:

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const { crudController } = require('../libs/controller/crud');
const Product = require('../models/Product');

// Create controller instance
const productController = crudController(Product);

// Standard CRUD routes
router.get('/', productController.list);        // Paginated list
router.get('/all', productController.all);     // All records
router.get('/search', productController.search); // Advanced search
router.get('/:id', productController.read);    // Single record
router.post('/', productController.create);    // Create
router.put('/:id', productController.update);  // Update
router.delete('/:id', productController.delete); // Delete

// Custom routes (if needed)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category');
    res.json({ success: true, result: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run directly with Node
node index.js

# Run with debugging enabled
DEBUG=* node index.js
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "lint": "eslint .",
    "docker:build": "docker build -t fear-api .",
    "docker:run": "docker run -p 4000:4000 fear-api"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "cloudinary": "^1.37.0",
    "dotenv": "^16.0.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "express-fileupload": "^1.4.0",
    "cors": "^2.8.5",
    "multer": "^1.4.5",
    "sharp": "^0.32.0",
    "winston": "^3.8.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}
```

### Custom Middleware

Add authentication or other middleware:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Use in routes
router.post('/', authenticate, productController.create);
```

## Deployment

### Production Environment

Set environment variables for production:

```env
NODE_ENV=production
NODE_PORT=4000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production_db
CLOUDINARY_NAME=your_production_cloud
API_KEY=your_production_key
API_SECRET=your_production_secret
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fearapi -u 1001

# Set ownership
RUN chown -R fearapi:nodejs /app
USER fearapi

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/fear/api/health || exit 1

CMD ["node", "index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  fear-api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/fear_db
      - ALLOWED_ORIGINS=https://yourdomain.com
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    restart: unless-stopped
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

### PM2 Deployment

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'fear-api',
    script: './FearServer.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};

# Deploy commands
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/fear-api
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```