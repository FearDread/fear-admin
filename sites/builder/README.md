# AI Agent Builder

A web-based tool for creating custom AI agents as standalone Node.js applications.

## Quick Start

### 1. Create Project Structure

```bash
mkdir ai-agent-builder
cd ai-agent-builder
mkdir public
```

### 2. Add Files

Create these files in your project:

- `server.js` (in root directory)
- `package.json` (in root directory)
- `public/index.html` (in public directory)

Copy the code from the artifacts I provided into each file.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Builder

```bash
npm start
```

### 5. Open in Browser

Navigate to: `http://localhost:4000`

## How to Use

1. **Fill out the form:**
   - Enter your agent's name and description
   - Define its primary function
   - Choose personality type
   - Select tools/capabilities
   - Configure API settings

2. **Generate the agent:**
   - Click "Generate Agent Code"
   - Download all generated files

3. **Deploy your agent:**
   - Create a new folder for your agent
   - Place all downloaded files inside
   - Run `npm install`
   - Create `.env` file with your API key
   - Run `npm start`
   - Access your agent at the specified port

## Project Structure

```
ai-agent-builder/
├── server.js           # Express server
├── package.json        # Dependencies
├── public/
│   └── index.html     # Frontend interface
└── README.md          # This file
```

## Generated Agent Structure

Each generated agent includes:

```
my-custom-agent/
├── server.js          # Agent server with Claude integration
├── package.json       # Agent dependencies
├── README.md         # Agent setup instructions
└── .env.example      # Environment variable template
```

## Requirements

- Node.js 18 or higher
- Anthropic API key (get one at console.anthropic.com)

## Features

- Visual form builder
- Multiple personality types
- Tool selection (web search, file system, calculator, database)
- Model selection (Sonnet, Opus, Haiku)
- Generates complete standalone applications
- Beautiful chat interface included

## Tips

- Start with a clear agent name and description
- Choose tools based on your agent's purpose
- Use Claude Sonnet 4 for best balance of speed and quality
- Test your generated agents locally before deployment

## Troubleshooting

**Port already in use?**
- Change the port in the form or use a different port number

**API key errors?**
- Make sure you've added your Anthropic API key to the `.env` file
- Format: `ANTHROPIC_API_KEY=sk-ant-your-key-here`

**Module not found errors?**
- Run `npm install` in the agent directory
- Make sure all files are in the correct locations

## License

MIT