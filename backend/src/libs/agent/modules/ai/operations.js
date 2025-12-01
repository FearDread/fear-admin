// modules/ai/operations.js - Enhanced AI Operations & Security Analysis
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');
const readline = require('readline');

const AIOperations = function (config) {
    this.config = config;
    this.conversationHistory = [];
    this.maxHistoryLength = 20;

    this.systemPrompt = `You are an advanced AI assistant specializing in:
- Security analysis and vulnerability assessment
- Cybersecurity best practices and threat modeling
- Node.js development and architecture
- Code review and optimization
- Web application security (OWASP Top 10)
- Penetration testing concepts and methodologies

Your communication style:
- Clear, concise, and actionable responses
- Technical depth appropriate to the question
- Security-focused perspective
- Practical examples and code snippets when helpful
- Emphasis on ethical practices and responsible disclosure

Always provide comprehensive, accurate, and helpful information.`;
};

AIOperations.prototype = {

    analyzeCode(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const filePath = args[0];
        if (!filePath) {
            console.log(colorizer.error('Usage: ai-analyze <file-path>'));
            console.log(colorizer.info('Example: ai-analyze ./src/auth.js\n'));
            return Promise.resolve();
        }

        return fs.readFile(filePath, 'utf8')
            .then(code => {
                console.log(colorizer.header('AI Security Analysis'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('File: ') + colorizer.bright(filePath));
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Model: ') + colorizer.dim(this.config.getModel()));
                console.log(colorizer.cyan('Analyzing...\n'));

                const prompt = `You are a senior security engineer conducting a comprehensive code security audit.

File: ${filePath}

\`\`\`
${code}
\`\`\`

Provide a detailed security analysis with:

1. **CRITICAL VULNERABILITIES** - Immediate security risks
2. **HIGH PRIORITY ISSUES** - Serious concerns requiring attention
3. **MEDIUM PRIORITY ISSUES** - Important best practice violations
4. **LOW PRIORITY ISSUES** - Minor improvements

For each issue include:
- Severity level and CWE reference if applicable
- Specific line numbers or code sections
- Clear explanation of the vulnerability
- Concrete code examples showing the fix
- Potential impact if exploited

5. **SECURITY RECOMMENDATIONS**
- General security improvements
- Best practices to implement
- Tools or libraries to consider

Be thorough, specific, and actionable. Focus on real security concerns.`;

                return this.config.call(prompt, 6000);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator());
                console.log(colorizer.info('💡 Tip: Use "ai-chat" to ask follow-up questions\n'));
            })
            .catch(err => {
                console.log(colorizer.error('AI analysis failed: ' + err.message + '\n'));
            });
    },

    threatAssessment(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const description = args.join(' ');
        if (!description) {
            console.log(colorizer.error('Usage: ai-threat <threat description>'));
            console.log(colorizer.info('Examples:'));
            console.log(colorizer.dim('  ai-threat SQL injection in user login form'));
            console.log(colorizer.dim('  ai-threat XSS vulnerability in comment section\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Threat Assessment'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Query: ') + colorizer.bright(description));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Analyzing threat...\n'));

        const prompt = `You are a cybersecurity expert conducting a threat assessment.

Threat/Vulnerability: "${description}"

Provide a comprehensive analysis:

1. **THREAT OVERVIEW**
   - What is this vulnerability/threat?
   - Technical explanation of the attack mechanism

2. **SEVERITY ASSESSMENT**
   - Severity Level: CRITICAL/HIGH/MEDIUM/LOW
   - CVSS Score (if applicable)
   - Justification for severity rating

3. **ATTACK VECTORS**
   - How can this be exploited?
   - Prerequisites for exploitation
   - Common attack scenarios

4. **POTENTIAL IMPACT**
   - Confidentiality impact
   - Integrity impact
   - Availability impact
   - Business consequences

5. **MITIGATION STRATEGIES**
   - Immediate countermeasures
   - Long-term preventive measures
   - Code examples of secure implementation

6. **DETECTION & MONITORING**
   - How to identify if you're vulnerable
   - Indicators of compromise (IOCs)
   - Monitoring strategies

7. **REAL-WORLD CONTEXT**
   - Known exploits or CVEs
   - Recent incidents if relevant
   - Industry best practices

Be practical, specific, and security-focused.`;

        return this.config.call(prompt, 5000)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Threat assessment failed: ' + err.message + '\n'));
            });
    },

    explainVulnerability(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const vulnerability = args.join(' ');
        if (!vulnerability) {
            console.log(colorizer.error('Usage: ai-explain <vulnerability or CWE>'));
            console.log(colorizer.info('Examples:'));
            console.log(colorizer.dim('  ai-explain CWE-79'));
            console.log(colorizer.dim('  ai-explain XSS vulnerability'));
            console.log(colorizer.dim('  ai-explain buffer overflow\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Vulnerability Explanation'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Topic: ') + colorizer.bright(vulnerability));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Generating explanation...\n'));

        const prompt = `Provide a comprehensive educational explanation of this security concept:

Topic: "${vulnerability}"

Structure your response:

1. **DEFINITION**
   - What is it in simple terms?
   - Technical definition

2. **HOW IT WORKS**
   - Technical mechanism explained step-by-step
   - Attack flow or exploitation process

3. **WHY IT'S DANGEROUS**
   - Potential consequences and impact
   - Real-world risk scenarios

4. **COMMON SCENARIOS**
   - Where this vulnerability typically appears
   - Programming languages/frameworks most affected
   - Common coding mistakes that cause it

5. **PREVENTION**
   - Best practices to avoid it
   - Secure coding guidelines
   - Security controls and defenses

6. **CODE EXAMPLES**
   - Vulnerable code example
   - Secure/fixed code example
   - Explanation of the differences

7. **DETECTION**
   - How to identify this vulnerability
   - Tools that can detect it
   - Testing approaches

Keep it educational, clear, and practical.`;

        return this.config.call(prompt, 5000)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Explanation failed: ' + err.message + '\n'));
            });
    },

    generateNodeCode(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const taskDescription = args.join(' ');
        if (!taskDescription) {
            console.log(colorizer.error('Usage: ai-generate <task description>'));
            console.log(colorizer.info('Examples:'));
            console.log(colorizer.dim('  ai-generate Express API with JWT authentication'));
            console.log(colorizer.dim('  ai-generate Rate limiter middleware for Express\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Code Generation'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Task: ') + colorizer.bright(taskDescription));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Generating code...\n'));

        const prompt = `You are an expert Node.js developer. Generate production-ready, secure Node.js code.

Task: ${taskDescription}

Requirements:
1. Include all necessary imports and dependencies
2. Implement comprehensive error handling
3. Follow Node.js and JavaScript best practices
4. Add security measures (input validation, sanitization, etc.)
5. Include clear comments explaining key sections
6. Make code efficient and performant
7. Follow OWASP security guidelines
8. Include usage examples if applicable

Provide complete, working code that can be used immediately. If the code needs a specific npm package, mention it.`;

        return this.config.call(prompt, 6000)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Code generation failed: ' + err.message + '\n'));
            });
    },

    analyzeTrafficPattern(trafficData) {
        if (!this.config.isConfigured()) {
            return Promise.resolve(null);
        }

        const prompt = `Analyze this network traffic pattern for security concerns:

${JSON.stringify(trafficData, null, 2)}

Identify:
1. **Suspicious Patterns** - Anomalies in the traffic
2. **Potential Attacks** - DDoS, port scanning, brute force, etc.
3. **Risk Assessment** - Severity and likelihood
4. **Recommendations** - Immediate actions to take

Be concise and actionable. Focus on security-critical findings.`;

        return this.config.call(prompt, 3000)
            .catch(err => {
                console.error(colorizer.error('AI traffic analysis failed: ' + err.message));
                return null;
            });
    },

    compareCodeVersions(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const file1Path = args[0];
        const file2Path = args[1];

        if (!file1Path || !file2Path) {
            console.log(colorizer.error('Usage: ai-compare <original-file> <modified-file>'));
            console.log(colorizer.info('Example: ai-compare ./old/auth.js ./new/auth.js\n'));
            return Promise.resolve();
        }

        return Promise.all([
            fs.readFile(file1Path, 'utf8'),
            fs.readFile(file2Path, 'utf8')
        ])
            .then(([code1, code2]) => {
                console.log(colorizer.header('AI Code Security Comparison'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('Original: ') + colorizer.bright(file1Path));
                console.log(colorizer.cyan('Modified: ') + colorizer.bright(file2Path));
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Analyzing security implications...\n'));

                const prompt = `Compare these two code versions from a security perspective:

**Original Version** (${file1Path}):
\`\`\`
${code1}
\`\`\`

**Modified Version** (${file2Path}):
\`\`\`
${code2}
\`\`\`

Provide a detailed security comparison:

1. **NEW VULNERABILITIES INTRODUCED**
   - Security issues that didn't exist in original
   - Severity and impact of each
   - Specific code changes that introduced them

2. **SECURITY IMPROVEMENTS MADE**
   - Vulnerabilities fixed or mitigated
   - Better security practices implemented
   - Defense mechanisms added

3. **SECURITY REGRESSIONS**
   - Previously secure code made less secure
   - Removed security controls
   - Weakened defenses

4. **FUNCTIONALITY VS SECURITY TRADEOFFS**
   - New features that affect security posture
   - Performance changes with security implications

5. **OVERALL SECURITY IMPACT**
   - Net security improvement or degradation
   - Risk assessment: Better/Worse/Neutral
   - Recommendations for next steps

Focus only on security-relevant changes. Be specific and actionable.`;

                return this.config.call(prompt, 5000);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Comparison failed: ' + err.message + '\n'));
            });
    },

    suggestImprovements(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const projectPath = args[0] || '.';
        const pkgPath = path.join(projectPath, 'package.json');

        return fs.readFile(pkgPath, 'utf8')
            .catch(() => '')
            .then(pkg => {
                const projectInfo = pkg ? `Package.json:\n\`\`\`json\n${pkg}\n\`\`\`\n` : 'No package.json found.\n';

                console.log(colorizer.header('AI Security Recommendations'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('Project: ') + colorizer.bright(projectPath));
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Generating improvement plan...\n'));

                const prompt = `As a senior security consultant, provide a comprehensive security improvement plan for this Node.js project:

${projectInfo}

Provide actionable recommendations:

1. **QUICK WINS** (Implement Today)
   - Easy security improvements with high impact
   - Configuration changes
   - Simple code updates

2. **CRITICAL PRIORITIES** (This Week)
   - Must-fix security issues
   - High-risk vulnerabilities
   - Essential security controls

3. **DEPENDENCY SECURITY**
   - Vulnerable packages to update
   - Unnecessary dependencies to remove
   - Suggested secure alternatives

4. **SECURITY BEST PRACTICES** (This Month)
   - Security measures to implement
   - Code patterns to adopt
   - Architecture improvements

5. **TOOLS & INTEGRATION** (Ongoing)
   - Security scanning tools (SAST, DAST, SCA)
   - Monitoring and logging solutions
   - CI/CD security pipeline additions

6. **DEVELOPMENT WORKFLOW**
   - Security review processes
   - Secure coding guidelines
   - Training and awareness

7. **LONG-TERM STRATEGY** (Quarterly)
   - Security architecture evolution
   - Compliance considerations (OWASP, SOC 2, etc.)
   - Incident response planning

Be practical, prioritized, and specific. Include concrete examples where applicable.`;

                return this.config.call(prompt, 5000);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Recommendations failed: ' + err.message + '\n'));
            });
    },

    chat(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const query = args.join(' ');

        // If no query provided, enter interactive mode
        if (!query) {
            return this.startInteractiveChat();
        }

        // Single query mode
        console.log(colorizer.header('AI Assistant'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Query: ') + colorizer.bright(query));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Thinking...\n'));

        const prompt = this.buildPromptWithHistory(query);

        return this.config.call(prompt, 4096)
            .then(response => {
                // Add to conversation history
                this.addToHistory('user', query);
                this.addToHistory('assistant', response);

                console.log(response);
                console.log('\n' + colorizer.separator());
                console.log(colorizer.info('💡 Tip: Run "ai-chat" without arguments for interactive mode\n'));
            })
            .catch(err => {
                console.log(colorizer.error('Chat failed: ' + err.message + '\n'));
            });
    },

    startInteractiveChat() {
        console.log(colorizer.header('AI Interactive Chat'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Model: ') + colorizer.dim(this.config.getModel()));
        console.log();
        console.log(colorizer.info('Commands:'));
        console.log(colorizer.dim('  /exit or /quit - Exit chat'));
        console.log(colorizer.dim('  /clear - Clear conversation history'));
        console.log(colorizer.dim('  /history - Show conversation history'));
        console.log(colorizer.dim('  /save <filename> - Save conversation to file'));
        console.log(colorizer.dim('  /stream - Toggle streaming mode (Google Gemini only)'));
        console.log();
        console.log(colorizer.success('Chat started! Ask me anything...\n'));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: colorizer.cyan('You: ')
        });

        let streamMode = false;

        const handleInput = (input) => {
            const trimmedInput = input.trim();

            // Handle empty input
            if (!trimmedInput) {
                rl.prompt();
                return;
            }

            // Handle commands
            if (trimmedInput.startsWith('/')) {
                return this.handleChatCommand(trimmedInput, rl, () => handleInput, streamMode)
                    .then(result => {
                        if (result && result.exit) {
                            rl.close();
                            return;
                        }
                        if (result && result.streamMode !== undefined) {
                            streamMode = result.streamMode;
                        }
                        rl.prompt();
                    });
            }

            // Add user message to history
            this.addToHistory('user', trimmedInput);

            // Build prompt with context
            const prompt = this.buildPromptWithHistory(trimmedInput);

            console.log(colorizer.dim('\nAI: '));

            // Use streaming if enabled and provider supports it
            if (streamMode && this.config.provider === 'google') {
                let response = '';
                this.config.callStream(prompt, 4096, (chunk) => {
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
                this.config.call(prompt, 4096)
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
                console.log(colorizer.info('\nChat ended. Goodbye!\n'));
                resolve();
            });
        });
    },

    handleChatCommand(command, rl, handleInput, streamMode) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();

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
                const filename = parts[1] || `chat_${Date.now()}.txt`;
                return this.saveConversation(filename);

            case '/stream':
                if (this.config.provider === 'google') {
                    streamMode = !streamMode;
                    console.log(colorizer.success(`Streaming mode ${streamMode ? 'enabled' : 'disabled'}.\n`));
                    return Promise.resolve({ streamMode });
                } else {
                    console.log(colorizer.warning('Streaming only available with Google Gemini.\n'));
                    return Promise.resolve();
                }

            case '/help':
                console.log(colorizer.info('Available commands:'));
                console.log(colorizer.dim('  /exit, /quit - Exit chat'));
                console.log(colorizer.dim('  /clear - Clear conversation history'));
                console.log(colorizer.dim('  /history - Show conversation history'));
                console.log(colorizer.dim('  /save <filename> - Save conversation'));
                console.log(colorizer.dim('  /stream - Toggle streaming (Gemini only)'));
                console.log(colorizer.dim('  /help - Show this help\n'));
                return Promise.resolve();

            default:
                console.log(colorizer.warning('Unknown command. Type /help for available commands.\n'));
                return Promise.resolve();
        }
    },

    buildPromptWithHistory(currentQuery) {
        let prompt = this.systemPrompt + '\n\n';

        // Add conversation history if available
        if (this.conversationHistory.length > 0) {
            prompt += 'Previous conversation:\n';
            this.conversationHistory.forEach(msg => {
                prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
            prompt += '\n';
        }

        prompt += `Current user question: ${currentQuery}\n\n`;
        prompt += 'Provide a comprehensive, helpful response that addresses the user\'s question with practical, actionable information. If this is a follow-up question, consider the previous conversation context.';

        return prompt;
    },

    addToHistory(role, content) {
        this.conversationHistory.push({ role, content, timestamp: Date.now() });

        // Trim history if it gets too long
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

        this.conversationHistory.forEach((msg, index) => {
            const role = msg.role === 'user' ? colorizer.cyan('You') : colorizer.green('AI');
            const preview = msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '');
            console.log(`${index + 1}. ${role}: ${preview}`);
        });

        console.log();
        return Promise.resolve();
    },

    saveConversation(filename) {
        if (this.conversationHistory.length === 0) {
            console.log(colorizer.warning('No conversation to save.\n'));
            return Promise.resolve();
        }

        let content = '# AI Chat Conversation\n\n';
        content += `Date: ${new Date().toISOString()}\n`;
        content += `Provider: ${this.config.getProviderName()}\n`;
        content += `Model: ${this.config.getModel()}\n\n`;
        content += '---\n\n';

        this.conversationHistory.forEach((msg, index) => {
            content += `## ${msg.role === 'user' ? 'User' : 'AI Assistant'} (Message ${index + 1})\n\n`;
            content += msg.content + '\n\n';
            content += '---\n\n';
        });

        return fs.writeFile(filename, content)
            .then(() => {
                console.log(colorizer.success(`Conversation saved to ${filename}\n`));
            })
            .catch(err => {
                console.log(colorizer.error(`Failed to save conversation: ${err.message}\n`));
            });
    },

    clearHistory() {
        this.conversationHistory = [];
    },

    // Batch analyze multiple files
    analyzeBatch(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const directory = args[0] || '.';
        const extension = args[1] || '.js';

        console.log(colorizer.header('AI Batch Security Analysis'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Directory: ') + colorizer.bright(directory));
        console.log(colorizer.cyan('Extension: ') + colorizer.bright(extension));
        console.log(colorizer.cyan('Scanning for files...\n'));

        return this.findFiles(directory, extension)
            .then(files => {
                if (files.length === 0) {
                    console.log(colorizer.warning('No files found.\n'));
                    return;
                }

                console.log(colorizer.info(`Found ${files.length} file(s)\n`));

                // Analyze each file
                return files.reduce((promise, file) => {
                    return promise.then(() => {
                        console.log(colorizer.cyan('\nAnalyzing: ') + file);
                        return this.analyzeCode([file])
                            .catch(err => {
                                console.log(colorizer.warning(`Skipped ${file}: ${err.message}`));
                            });
                    });
                }, Promise.resolve());
            })
            .then(() => {
                console.log(colorizer.success('\nBatch analysis complete!\n'));
            })
            .catch(err => {
                console.log(colorizer.error('Batch analysis failed: ' + err.message + '\n'));
            });
    },

    findFiles(dir, extension) {
        return fs.readdir(dir, { withFileTypes: true })
            .then(items => {
                const promises = items.map(item => {
                    const fullPath = path.join(dir, item.name);

                    if (item.isDirectory() && !['node_modules', '.git', 'dist'].includes(item.name)) {
                        return this.findFiles(fullPath, extension);
                    } else if (item.isFile() && fullPath.endsWith(extension)) {
                        return [fullPath];
                    }
                    return [];
                });

                return Promise.all(promises);
            })
            .then(results => results.flat())
            .catch(() => []);
    }
};

module.exports = AIOperations;