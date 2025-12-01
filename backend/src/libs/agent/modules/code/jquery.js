// modules/code/jquery-to-react.js - jQuery to React Converter
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const JQueryToReact = function() {
  this.stateVariables = new Map();
  this.refVariables = new Set();
  this.effects = [];
  this.functions = [];
  this.eventHandlers = new Map();
  this.ajaxCalls = [];
  this.animations = [];
  this.hooks = new Set();
  this.componentName = '';
  this.imports = new Set(['React']);
}

JQueryToReact.prototype = {
  
  convert(args) {
    const filePath = args[0];
    const outputPath = args[1] || filePath.replace(/\.js$/, '.jsx');
    
    if (!filePath) {
      console.log(colorizer.error('Usage: jquery-to-react <jquery-file.js> [output-file.jsx]'));
      console.log(colorizer.info('Examples:'));
      console.log(colorizer.dim('  jquery-to-react script.js'));
      console.log(colorizer.dim('  jquery-to-react old-app.js new-app.jsx\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('jQuery to React Converter'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Input: ') + colorizer.bright(filePath));
    console.log(colorizer.cyan('Output: ') + colorizer.bright(outputPath));
    console.log();

    return fs.readFile(filePath, 'utf8')
      .then(code => {
        console.log(colorizer.info('Analyzing jQuery code...'));
        
        // Reset state
        this.reset();
        
        // Set component name from filename
        this.componentName = this.toPascalCase(
          path.basename(filePath, path.extname(filePath))
        );
        
        // Analyze and convert
        const reactCode = this.convertJQueryToReact(code);
        
        return fs.writeFile(outputPath, reactCode);
      })
      .then(() => {
        console.log(colorizer.success('\nConversion complete!'));
        console.log(colorizer.cyan('Generated: ') + colorizer.bright(outputPath));
        console.log();
        
        this.printConversionSummary();
      })
      .catch(err => {
        console.log(colorizer.error('Conversion failed: ' + err.message));
        if (err.stack) {
          console.log(colorizer.dim(err.stack));
        }
        console.log();
      });
  },

  reset() {
    this.stateVariables.clear();
    this.refVariables.clear();
    this.effects = [];
    this.functions = [];
    this.eventHandlers.clear();
    this.ajaxCalls = [];
    this.animations = [];
    this.hooks.clear();
    this.imports.clear();
    this.imports.add('React');
  },

  convertJQueryToReact(jqueryCode) {
    // Clean up the code
    let code = this.cleanCode(jqueryCode);
    
    // Extract different patterns
    this.extractVariables(code);
    this.extractDOMReady(code);
    this.extractEventHandlers(code);
    this.extractAjaxCalls(code);
    this.extractAnimations(code);
    this.extractFunctions(code);
    this.extractDOMManipulation(code);
    this.extractSelectors(code);
    
    // Generate React component
    return this.generateReactComponent();
  },

  cleanCode(code) {
    // Remove comments but preserve structure
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*/g, '');
    
    return code;
  },

  extractVariables(code) {
    // Extract variable declarations
    const varRegex = /(var|let|const)\s+(\w+)\s*=\s*([^;]+);/g;
    let match;
    
    while ((match = varRegex.exec(code)) !== null) {
      const [, type, name, value] = match;
      
      // Determine if it needs to be state
      if (this.needsState(name, value, code)) {
        this.stateVariables.set(name, {
          initialValue: value.trim(),
          type: 'state'
        });
        this.hooks.add('useState');
        console.log(colorizer.info('  Converting to state: ' + name));
      } else if (this.isConstant(name)) {
        this.stateVariables.set(name, {
          initialValue: value.trim(),
          type: 'const'
        });
      }
    }
  },

  needsState(varName, value, code) {
    // Check if variable is modified after declaration
    const assignmentRegex = new RegExp(`\\b${varName}\\s*=\\s*[^=]`, 'g');
    const matches = code.match(assignmentRegex);
    
    // If modified, needs state
    if (matches && matches.length > 0) {
      return true;
    }
    
    // Check if used in DOM manipulation
    const domManipRegex = new RegExp(`${varName}[\\s\\S]*?\\.(?:html|text|val|attr|prop|css|show|hide)\\s*\\(`, 'g');
    if (domManipRegex.test(code)) {
      return true;
    }
    
    return false;
  },

  isConstant(varName) {
    return /^[A-Z_]+$/.test(varName) || 
           varName.startsWith('CONFIG') || 
           varName.startsWith('CONST');
  },

  extractDOMReady(code) {
    const patterns = [
      /\$\(document\)\.ready\s*\(\s*function\s*\(\)\s*\{([\s\S]*?)\}\s*\)/g,
      /\$\(function\s*\(\)\s*\{([\s\S]*?)\}\s*\)/g,
      /document\.addEventListener\s*\(\s*['"]DOMContentLoaded['"]\s*,\s*function\s*\(\)\s*\{([\s\S]*?)\}\s*\)/g,
      /\$\(document\)\.ready\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const initCode = match[1];
        if (initCode && initCode.trim()) {
          this.effects.push({
            type: 'mount',
            code: this.convertCodeBlock(initCode),
            dependencies: '[]',
            comment: 'Component initialization (converted from $(document).ready)'
          });
          this.hooks.add('useEffect');
          console.log(colorizer.info('  Found DOM ready handler'));
        }
      }
    });
  },

  extractEventHandlers(code) {
    // Pattern: $('.selector').on('event', handler)
    const onPattern = /\$\(['"](.*?)['"]\)\.on\s*\(\s*['"](\w+)['"]\s*,\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})\s*\)/g;
    let match;
    
    while ((match = onPattern.exec(code)) !== null) {
      const [, selector, event, handler] = match;
      this.addEventHandler(selector, event, handler);
    }
    
    // Pattern: $('.selector').click(handler)
    const eventMethods = ['click', 'change', 'submit', 'keyup', 'keydown', 'focus', 'blur', 'input', 'mouseover', 'mouseout'];
    eventMethods.forEach(event => {
      const pattern = new RegExp(`\\$\\(['"](.*?)['"]\\)\\.${event}\\s*\\(\\s*(function[^}]*\\{[\\s\\S]*?\\}|\\([^)]*\\)\\s*=>\\s*\\{[\\s\\S]*?\\})\\s*\\)`, 'g');
      
      while ((match = pattern.exec(code)) !== null) {
        const [, selector, handler] = match;
        this.addEventHandler(selector, event, handler);
      }
    });
    
    // Pattern: $(selector).on('event', '.child', handler) - event delegation
    const delegationPattern = /\$\(['"](.*?)['"]\)\.on\s*\(\s*['"](\w+)['"]\s*,\s*['"](.*?)['"]\s*,\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})\s*\)/g;
    
    while ((match = delegationPattern.exec(code)) !== null) {
      const [, parentSelector, event, childSelector, handler] = match;
      this.addEventHandler(childSelector, event, handler, parentSelector);
    }
  },

  addEventHandler(selector, event, handler, parentSelector = null) {
    const refName = this.selectorToRefName(selector);
    const handlerName = this.generateHandlerName(selector, event);
    const convertedHandler = this.convertFunctionBody(handler);
    
    this.refVariables.add(refName);
    this.hooks.add('useRef');
    
    this.eventHandlers.set(handlerName, {
      selector,
      event,
      refName,
      handler: convertedHandler,
      parentSelector
    });
    
    // Add effect to attach event listener
    this.effects.push({
      type: 'event',
      code: this.generateEventEffect(refName, event, handlerName),
      dependencies: `[${this.extractHandlerDependencies(convertedHandler).join(', ')}]`,
      comment: `Event listener for ${event} on ${selector}`
    });
    
    this.hooks.add('useEffect');
    console.log(colorizer.info(`  Found event handler: ${selector}.${event}()`));
  },

  extractAjaxCalls(code) {
    // $.ajax() calls
    const ajaxPattern = /\$\.ajax\s*\(\s*\{([\s\S]*?)\}\s*\)/g;
    let match;
    
    while ((match = ajaxPattern.exec(code)) !== null) {
      const config = this.parseAjaxConfig(match[1]);
      this.ajaxCalls.push({
        type: 'ajax',
        config,
        converted: this.convertAjaxToFetch(config)
      });
      console.log(colorizer.info('  Found $.ajax() call'));
    }
    
    // $.get() calls
    const getPattern = /\$\.get\s*\(\s*['"](.*?)['"]\s*,?\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})?\s*\)/g;
    
    while ((match = getPattern.exec(code)) !== null) {
      const [, url, callback] = match;
      this.ajaxCalls.push({
        type: 'get',
        url,
        callback: callback ? this.convertFunctionBody(callback) : null,
        converted: this.convertGetToFetch(url, callback)
      });
      console.log(colorizer.info('  Found $.get() call'));
    }
    
    // $.post() calls
    const postPattern = /\$\.post\s*\(\s*['"](.*?)['"]\s*,\s*([^,]+)\s*,?\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})?\s*\)/g;
    
    while ((match = postPattern.exec(code)) !== null) {
      const [, url, data, callback] = match;
      this.ajaxCalls.push({
        type: 'post',
        url,
        data,
        callback: callback ? this.convertFunctionBody(callback) : null,
        converted: this.convertPostToFetch(url, data, callback)
      });
      console.log(colorizer.info('  Found $.post() call'));
    }
    
    if (this.ajaxCalls.length > 0) {
      this.hooks.add('useEffect');
      this.hooks.add('useState');
    }
  },

  parseAjaxConfig(configStr) {
    const config = {};
    
    // Extract URL
    const urlMatch = configStr.match(/url\s*:\s*['"](.*?)['"]/);
    if (urlMatch) config.url = urlMatch[1];
    
    // Extract method
    const methodMatch = configStr.match(/(?:method|type)\s*:\s*['"](.*?)['"]/i);
    if (methodMatch) config.method = methodMatch[1].toUpperCase();
    
    // Extract data
    const dataMatch = configStr.match(/data\s*:\s*([^,}]+)/);
    if (dataMatch) config.data = dataMatch[1].trim();
    
    // Extract success callback
    const successMatch = configStr.match(/success\s*:\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})/);
    if (successMatch) config.success = this.convertFunctionBody(successMatch[1]);
    
    // Extract error callback
    const errorMatch = configStr.match(/error\s*:\s*(function[^}]*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\})/);
    if (errorMatch) config.error = this.convertFunctionBody(errorMatch[1]);
    
    return config;
  },

  convertAjaxToFetch(config) {
    let code = `fetch('${config.url || 'URL_HERE'}', {\n`;
    code += `  method: '${config.method || 'GET'}',\n`;
    
    if (config.data) {
      code += `  headers: { 'Content-Type': 'application/json' },\n`;
      code += `  body: JSON.stringify(${config.data})\n`;
    }
    
    code += `})\n`;
    code += `  .then(response => response.json())\n`;
    
    if (config.success) {
      code += `  .then(data => {\n    ${config.success}\n  })\n`;
    } else {
      code += `  .then(data => {\n    // Handle success\n    console.log(data);\n  })\n`;
    }
    
    if (config.error) {
      code += `  .catch(error => {\n    ${config.error}\n  });\n`;
    } else {
      code += `  .catch(error => {\n    console.error('Error:', error);\n  });\n`;
    }
    
    return code;
  },

  convertGetToFetch(url, callback) {
    let code = `fetch('${url}')\n`;
    code += `  .then(response => response.json())\n`;
    
    if (callback) {
      code += `  .then(data => {\n    ${callback}\n  })\n`;
    } else {
      code += `  .then(data => {\n    // Handle response\n    console.log(data);\n  })\n`;
    }
    
    code += `  .catch(error => console.error('Error:', error));\n`;
    
    return code;
  },

  convertPostToFetch(url, data, callback) {
    let code = `fetch('${url}', {\n`;
    code += `  method: 'POST',\n`;
    code += `  headers: { 'Content-Type': 'application/json' },\n`;
    code += `  body: JSON.stringify(${data})\n`;
    code += `})\n`;
    code += `  .then(response => response.json())\n`;
    
    if (callback) {
      code += `  .then(data => {\n    ${callback}\n  })\n`;
    } else {
      code += `  .then(data => {\n    // Handle response\n    console.log(data);\n  })\n`;
    }
    
    code += `  .catch(error => console.error('Error:', error));\n`;
    
    return code;
  },

  extractAnimations(code) {
    const animMethods = ['show', 'hide', 'toggle', 'fadeIn', 'fadeOut', 'fadeToggle', 'slideUp', 'slideDown', 'slideToggle', 'animate'];
    
    animMethods.forEach(method => {
      const pattern = new RegExp(`\\$\\(['"](.*?)['"]\\)\\.${method}\\s*\\(([^)]*)\\)`, 'g');
      let match;
      
      while ((match = pattern.exec(code)) !== null) {
        const [, selector, args] = match;
        this.animations.push({
          selector,
          method,
          args: args.trim(),
          suggestion: this.getAnimationSuggestion(method)
        });
        console.log(colorizer.warning(`  Found animation: ${selector}.${method}() - requires CSS/library`));
      }
    });
  },

  getAnimationSuggestion(method) {
    const suggestions = {
      'show': 'Use CSS display or visibility with state',
      'hide': 'Use CSS display or visibility with state',
      'toggle': 'Toggle visibility state with conditional rendering',
      'fadeIn': 'Use CSS transition with opacity',
      'fadeOut': 'Use CSS transition with opacity',
      'fadeToggle': 'Toggle opacity state with CSS transition',
      'slideUp': 'Use CSS transition with max-height',
      'slideDown': 'Use CSS transition with max-height',
      'slideToggle': 'Toggle height state with CSS transition',
      'animate': 'Use CSS animations or libraries like Framer Motion, React Spring'
    };
    
    return suggestions[method] || 'Convert to CSS animations or use animation library';
  },

  extractFunctions(code) {
    // Regular function declarations
    const funcPattern = /function\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}/g;
    let match;
    
    while ((match = funcPattern.exec(code)) !== null) {
      const [, name, params, body] = match;
      
      // Skip if it's an event handler (already extracted)
      if (!Array.from(this.eventHandlers.keys()).some(h => h.includes(name))) {
        this.functions.push({
          name,
          params: params.trim(),
          body: this.convertFunctionBody(body),
          isAsync: this.containsAjax(body)
        });
        console.log(colorizer.info(`  Found function: ${name}()`));
      }
    }
    
    // Arrow function assignments
    const arrowPattern = /(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\n\}/g;
    
    while ((match = arrowPattern.exec(code)) !== null) {
      const [, name, params, body] = match;
      
      if (!Array.from(this.eventHandlers.keys()).some(h => h.includes(name))) {
        this.functions.push({
          name,
          params: params.trim(),
          body: this.convertFunctionBody(body),
          isAsync: this.containsAjax(body),
          isArrow: true
        });
        console.log(colorizer.info(`  Found arrow function: ${name}()`));
      }
    }
  },

  containsAjax(code) {
    return /\$\.(ajax|get|post)|fetch\(/.test(code);
  },

  extractDOMManipulation(code) {
    // .html()
    const htmlPattern = /\$\(['"](.*?)['"]\)\.html\s*\(\s*([^)]+)\s*\)/g;
    let match;
    
    while ((match = htmlPattern.exec(code)) !== null) {
      const [, selector, content] = match;
      const varName = this.selectorToStateName(selector);
      
      this.stateVariables.set(varName, {
        initialValue: "''",
        type: 'state',
        purpose: 'DOM content'
      });
      this.hooks.add('useState');
      console.log(colorizer.info(`  Converting .html() to state: ${varName}`));
    }
    
    // .text()
    const textPattern = /\$\(['"](.*?)['"]\)\.text\s*\(\s*([^)]+)\s*\)/g;
    
    while ((match = textPattern.exec(code)) !== null) {
      const [, selector, content] = match;
      const varName = this.selectorToStateName(selector);
      
      this.stateVariables.set(varName, {
        initialValue: "''",
        type: 'state',
        purpose: 'Text content'
      });
      this.hooks.add('useState');
      console.log(colorizer.info(`  Converting .text() to state: ${varName}`));
    }
    
    // .val()
    const valPattern = /\$\(['"](.*?)['"]\)\.val\s*\(\s*([^)]*)\s*\)/g;
    
    while ((match = valPattern.exec(code)) !== null) {
      const [, selector, value] = match;
      const varName = this.selectorToStateName(selector);
      
      this.stateVariables.set(varName, {
        initialValue: "''",
        type: 'state',
        purpose: 'Form input value'
      });
      this.hooks.add('useState');
      console.log(colorizer.info(`  Converting .val() to controlled input: ${varName}`));
    }
    
    // .show() / .hide()
    const visibilityPattern = /\$\(['"](.*?)['"]\)\.(show|hide)\s*\(/g;
    
    while ((match = visibilityPattern.exec(code)) !== null) {
      const [, selector, method] = match;
      const varName = `${this.selectorToStateName(selector)}Visible`;
      
      this.stateVariables.set(varName, {
        initialValue: method === 'show' ? 'true' : 'false',
        type: 'state',
        purpose: 'Visibility toggle'
      });
      this.hooks.add('useState');
      console.log(colorizer.info(`  Converting .${method}() to state: ${varName}`));
    }
    
    // .addClass() / .removeClass() / .toggleClass()
    const classPattern = /\$\(['"](.*?)['"]\)\.(addClass|removeClass|toggleClass)\s*\(\s*['"](.*?)['"]\s*\)/g;
    
    while ((match = classPattern.exec(code)) !== null) {
      const [, selector, method, className] = match;
      const varName = `${this.selectorToStateName(selector)}Class`;
      
      this.stateVariables.set(varName, {
        initialValue: "''",
        type: 'state',
        purpose: `CSS class management for ${className}`
      });
      this.hooks.add('useState');
      console.log(colorizer.info(`  Converting .${method}() to className state: ${varName}`));
    }
  },

  extractSelectors(code) {
    // Extract all jQuery selectors that aren't already handled
    const selectorPattern = /\$\(['"]((?:#|\.)?[\w-]+)['"]\)/g;
    let match;
    
    const seenSelectors = new Set();
    
    while ((match = selectorPattern.exec(code)) !== null) {
      const selector = match[1];
      
      if (!seenSelectors.has(selector) && selector.startsWith('#')) {
        const refName = this.selectorToRefName(selector);
        this.refVariables.add(refName);
        this.hooks.add('useRef');
        seenSelectors.add(selector);
        console.log(colorizer.info(`  Creating ref for selector: ${selector}`));
      }
    }
  },

  convertCodeBlock(code) {
    let converted = code;
    
    // Convert jQuery selectors to refs
    converted = converted.replace(
      /\$\(['"]#([\w-]+)['"]\)/g,
      (match, id) => {
        const refName = this.toCamelCase(id);
        return `${refName}Ref.current`;
      }
    );
    
    // Convert class selectors
    converted = converted.replace(
      /\$\(['"]\.([\w-]+)['"]\)/g,
      (match, className) => {
        return `// TODO: Use ref or state for .${className}`;
      }
    );
    
    // Convert .html()
    converted = converted.replace(
      /\.html\s*\(\s*([^)]+)\s*\)/g,
      (match, content) => {
        return `// TODO: Use state or dangerouslySetInnerHTML`;
      }
    );
    
    // Convert .text()
    converted = converted.replace(
      /\.text\s*\(\s*([^)]+)\s*\)/g,
      (match, content) => {
        return `// TODO: Use state to set text content`;
      }
    );
    
    // Convert .val()
    converted = converted.replace(
      /\.val\s*\(\s*([^)]*)\s*\)/g,
      (match, value) => {
        if (value) {
          return `// TODO: Use setState to update input value`;
        } else {
          return `.value // TODO: Use state instead`;
        }
      }
    );
    
    // Convert .show() / .hide()
    converted = converted.replace(
      /\.(show|hide)\s*\(\)/g,
      '// TODO: Use state to toggle visibility'
    );
    
    // Convert .addClass() / .removeClass()
    converted = converted.replace(
      /\.(addClass|removeClass|toggleClass)\s*\([^)]+\)/g,
      '// TODO: Use className state'
    );
    
    // Convert .css()
    converted = converted.replace(
      /\.css\s*\([^)]+\)/g,
      '// TODO: Use inline style or CSS classes'
    );
    
    // Convert this to proper context
    converted = converted.replace(/\bthis\./g, '');
    
    return converted.trim();
  },

  convertFunctionBody(funcStr) {
    // Extract function body
    const bodyMatch = funcStr.match(/\{([\s\S]*)\}/);
    if (!bodyMatch) return funcStr;
    
    return this.convertCodeBlock(bodyMatch[1]);
  },

  generateEventEffect(refName, event, handlerName) {
    let code = `const element = ${refName}Ref.current;\n`;
    code += `if (element) {\n`;
    code += `  element.addEventListener('${event}', ${handlerName});\n`;
    code += `  return () => element.removeEventListener('${event}', ${handlerName});\n`;
    code += `}`;
    
    return code;
  },

  extractHandlerDependencies(handlerCode) {
    const deps = [];
    
    // Find state variables used in handler
    this.stateVariables.forEach((value, key) => {
      if (value.type === 'state' && handlerCode.includes(key)) {
        deps.push(key);
      }
    });
    
    return deps;
  },

  generateHandlerName(selector, event) {
    const selectorName = this.selectorToRefName(selector);
    const eventName = this.toPascalCase(event);
    return `handle${selectorName}${eventName}`;
  },

  selectorToRefName(selector) {
    return selector
      .replace(/^[#.]/, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  },

  selectorToStateName(selector) {
    return this.toCamelCase(
      selector
        .replace(/^[#.]/, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
    );
  },

  generateReactComponent() {
    let code = '';
    
    // Imports
    const hooks = Array.from(this.hooks).filter(h => h !== 'React');
    if (hooks.length > 0) {
      code += `import React, { ${hooks.join(', ')} } from 'react';\n`;
    } else {
      code += `import React from 'react';\n`;
    }
    
    code += '\n';
    
    // Component
    code += `function ${this.componentName}() {\n`;
    
    // State variables
    if (this.stateVariables.size > 0) {
      code += '  // State\n';
      this.stateVariables.forEach((value, key) => {
        if (value.type === 'state') {
          const setterName = `set${this.toPascalCase(key)}`;
          code += `  const [${key}, ${setterName}] = useState(${value.initialValue});`;
          if (value.purpose) {
            code += ` // ${value.purpose}`;
          }
          code += '\n';
        } else if (value.type === 'const') {
          code += `  const ${key} = ${value.initialValue};\n`;
        }
      });
      code += '\n';
    }
    
    // Refs
    if (this.refVariables.size > 0) {
      code += '  // Refs\n';
      this.refVariables.forEach(refName => {
        code += `  const ${refName}Ref = useRef(null);\n`;
      });
      code += '\n';
    }
    
    // Event handlers
    if (this.eventHandlers.size > 0) {
      code += '  // Event Handlers\n';
      this.eventHandlers.forEach((handler, name) => {
        code += `  const ${name} = (e) => {\n`;
        code += `    ${handler.handler.split('\n').join('\n    ')}\n`;
        code += `  };\n\n`;
      });
    }
    
    // Functions
    if (this.functions.length > 0) {
      code += '  // Functions\n';
      this.functions.forEach(func => {
        const asyncKeyword = func.isAsync ? 'async ' : '';
        code += `  const ${func.name} = ${asyncKeyword}(${func.params}) => {\n`;
        code += `    ${func.body.split('\n').join('\n    ')}\n`;
        code += `  };\n\n`;
      });
    }
    
    // Effects
    if (this.effects.length > 0) {
      code += '  // Effects\n';
      this.effects.forEach(effect => {
        if (effect.comment) {
          code += `  // ${effect.comment}\n`;
        }
        code += `  useEffect(() => {\n`;
        code += `    ${effect.code.split('\n').join('\n    ')}\n`;
        code += `  }, ${effect.dependencies});\n\n`;
      });
    }
    
    // AJAX calls in useEffect (if not already in effects)
    if (this.ajaxCalls.length > 0) {
      const standaloneAjax = this.ajaxCalls.filter(ajax => 
        !this.effects.some(e => e.code.includes('fetch'))
      );
      
      if (standaloneAjax.length > 0) {
        code += '  // Data Fetching\n';
        code += '  useEffect(() => {\n';
        standaloneAjax.forEach(ajax => {
          code += `    // Converted from ${ajax.type}\n`;
          code += `    ${ajax.converted.split('\n').join('\n    ')}\n`;
        });
        code += '  }, []);\n\n';
      }
    }
    
    // Return JSX
    code += '  return (\n';
    code += '    <div className="' + this.componentName.toLowerCase() + '">\n';
    code += '      {/* TODO: Add your JSX here */}\n';
    
    // Add ref examples
    if (this.refVariables.size > 0) {
      code += '      {/* Example refs: */}\n';
      this.refVariables.forEach(refName => {
        code += `      {/* <div ref={${refName}Ref}>...</div> */}\n`;
      });
    }
    
    // Add conditional rendering examples
    const visibilityStates = Array.from(this.stateVariables.entries())
      .filter(([key, val]) => val.purpose && val.purpose.includes('Visibility'));
    
    if (visibilityStates.length > 0) {
      code += '      {/* Conditional rendering: */}\n';
      visibilityStates.forEach(([key]) => {
        code += `      {/* {${key} && <div>Visible content</div>} */}\n`;
      });
    }
    
    // Add controlled input examples
    const inputStates = Array.from(this.stateVariables.entries())
      .filter(([key, val]) => val.purpose && val.purpose.includes('input'));
    
    if (inputStates.length > 0) {
      code += '      {/* Controlled inputs: */}\n';
      inputStates.forEach(([key]) => {
        const setterName = `set${this.toPascalCase(key)}`;
        code += `      {/* <input value={${key}} onChange={(e) => ${setterName}(e.target.value)} /> */}\n`;
      });
    }
    
    code += '    </div>\n';
    code += '  );\n';
    code += '}\n\n';
    code += `export default ${this.componentName};\n`;
    
    // Add conversion notes
    code += '\n/* CONVERSION NOTES:\n';
    code += ' * \n';
    code += ' * 1. All jQuery selectors have been converted to refs or state\n';
    code += ' * 2. Event handlers are attached using useEffect with cleanup\n';
    code += ' * 3. DOM manipulations should use state instead\n';
    code += ' * 4. AJAX calls converted to fetch API\n';
    
    if (this.animations.length > 0) {
      code += ' * \n';
      code += ' * ANIMATIONS DETECTED:\n';
      this.animations.forEach(anim => {
        code += ` *   - ${anim.selector}.${anim.method}() => ${anim.suggestion}\n`;
      });
    }
    
    code += ' * \n';
    code += ' * TODO Items:\n';
    code += ' * - Review all TODO comments in the code\n';
    code += ' * - Add proper JSX structure\n';
    code += ' * - Test event handlers\n';
    code += ' * - Verify state updates work correctly\n';
    code += ' * - Add error handling for async operations\n';
    
    if (this.animations.length > 0) {
      code += ' * - Implement animations with CSS or animation library\n';
    }
    
    code += ' */\n';
    
    return code;
  },

  printConversionSummary() {
    console.log(colorizer.section('Conversion Summary'));
    console.log(colorizer.cyan('  Component Name: ') + colorizer.bright(this.componentName));
    console.log(colorizer.cyan('  State Variables: ') + this.stateVariables.size);
    console.log(colorizer.cyan('  Refs: ') + this.refVariables.size);
    console.log(colorizer.cyan('  Event Handlers: ') + this.eventHandlers.size);
    console.log(colorizer.cyan('  Functions: ') + this.functions.length);
    console.log(colorizer.cyan('  Effects: ') + this.effects.length);
    console.log(colorizer.cyan('  AJAX Calls: ') + this.ajaxCalls.length);
    console.log(colorizer.cyan('  Animations: ') + this.animations.length);
    console.log(colorizer.cyan('  Hooks Used: ') + Array.from(this.hooks).join(', '));
    
    if (this.animations.length > 0) {
      console.log();
      console.log(colorizer.warning('⚠ Animations detected - will need CSS or animation library'));
    }
    
    console.log();
    console.log(colorizer.magenta('Next Steps:'));
    console.log(colorizer.bullet('Review the generated component'));
    console.log(colorizer.bullet('Add JSX structure'));
    console.log(colorizer.bullet('Test functionality'));
    console.log(colorizer.bullet('Address all TODO comments'));
    console.log();
  },

  analyzeBatch(args) {
    const inputDir = args[0] || '.';
    
    console.log(colorizer.header('jQuery Files Analysis'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Directory: ') + colorizer.bright(inputDir));
    console.log();

    return this.findJQueryFiles(inputDir)
      .then(files => {
        if (files.length === 0) {
          console.log(colorizer.warning('No jQuery files found\n'));
          return;
        }
        
        console.log(colorizer.info('Found ' + files.length + ' file(s) with jQuery\n'));
        
        const analyses = [];
        
        return Promise.all(files.map(file => {
          return fs.readFile(file, 'utf8')
            .then(code => {
              const analysis = this.analyzeJQueryFile(code, file);
              analyses.push({ file, analysis });
            });
        }))
        .then(() => {
          this.printBatchAnalysis(analyses);
        });
      })
      .catch(err => {
        console.log(colorizer.error('Analysis failed: ' + err.message + '\n'));
      });
  },

  findJQueryFiles(dir, files = []) {
    return fs.readdir(dir, { withFileTypes: true })
      .then(items => {
        const promises = items.map(item => {
          const fullPath = path.join(dir, item.name);
          
          if (['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
            return Promise.resolve();
          }
          
          if (item.isDirectory()) {
            return this.findJQueryFiles(fullPath, files);
          } else if (item.isFile() && path.extname(item.name).toLowerCase() === '.js') {
            return fs.readFile(fullPath, 'utf8')
              .then(content => {
                if (this.containsJQuery(content)) {
                  files.push(fullPath);
                }
              })
              .catch(() => {});
          }
          
          return Promise.resolve();
        });
        
        return Promise.all(promises);
      })
      .then(() => files)
      .catch(() => files);
  },

  containsJQuery(code) {
    return /\$\(|\$\./g.test(code) || code.includes('jQuery');
  },

  analyzeJQueryFile(code, filePath) {
    const analysis = {
      selectors: this.countMatches(code, /\$\(['"]/g),
      eventHandlers: this.countMatches(code, /\.(on|click|change|submit|keyup|keydown|focus|blur)\s*\(/g),
      domManipulation: this.countMatches(code, /\.(html|text|val|append|prepend|remove)\s*\(/g),
      ajax: this.countMatches(code, /\$\.(ajax|get|post)/g),
      animations: this.countMatches(code, /\.(show|hide|toggle|fade|slide|animate)\s*\(/g),
      cssManipulation: this.countMatches(code, /\.(css|addClass|removeClass|toggleClass)\s*\(/g),
      complexity: 0
    };
    
    // Calculate complexity score
    analysis.complexity = 
      analysis.selectors * 1 +
      analysis.eventHandlers * 2 +
      analysis.domManipulation * 2 +
      analysis.ajax * 3 +
      analysis.animations * 2 +
      analysis.cssManipulation * 1;
    
    return analysis;
  },

  countMatches(code, regex) {
    const matches = code.match(regex);
    return matches ? matches.length : 0;
  },

  printBatchAnalysis(analyses) {
    console.log(colorizer.section('Batch Analysis Results'));
    console.log();
    
    analyses.forEach(({ file, analysis }) => {
      const fileName = path.basename(file);
      const complexityLevel = 
        analysis.complexity > 20 ? colorizer.red('High') :
        analysis.complexity > 10 ? colorizer.yellow('Medium') :
        colorizer.green('Low');
      
      console.log(colorizer.bright(fileName));
      console.log(colorizer.cyan('  Selectors: ') + analysis.selectors);
      console.log(colorizer.cyan('  Event Handlers: ') + analysis.eventHandlers);
      console.log(colorizer.cyan('  DOM Manipulation: ') + analysis.domManipulation);
      console.log(colorizer.cyan('  AJAX Calls: ') + analysis.ajax);
      console.log(colorizer.cyan('  Animations: ') + analysis.animations);
      console.log(colorizer.cyan('  CSS Manipulation: ') + analysis.cssManipulation);
      console.log(colorizer.cyan('  Complexity: ') + complexityLevel + ' (' + analysis.complexity + ')');
      console.log();
    });
    
    const totals = analyses.reduce((acc, { analysis }) => ({
      selectors: acc.selectors + analysis.selectors,
      eventHandlers: acc.eventHandlers + analysis.eventHandlers,
      domManipulation: acc.domManipulation + analysis.domManipulation,
      ajax: acc.ajax + analysis.ajax,
      animations: acc.animations + analysis.animations,
      cssManipulation: acc.cssManipulation + analysis.cssManipulation
    }), {
      selectors: 0,
      eventHandlers: 0,
      domManipulation: 0,
      ajax: 0,
      animations: 0,
      cssManipulation: 0
    });
    
    console.log(colorizer.section('Totals'));
    console.log(colorizer.cyan('  Total Files: ') + analyses.length);
    console.log(colorizer.cyan('  Total Selectors: ') + totals.selectors);
    console.log(colorizer.cyan('  Total Event Handlers: ') + totals.eventHandlers);
    console.log(colorizer.cyan('  Total DOM Manipulations: ') + totals.domManipulation);
    console.log(colorizer.cyan('  Total AJAX Calls: ') + totals.ajax);
    console.log(colorizer.cyan('  Total Animations: ') + totals.animations);
    console.log();
  },

  convertBatch(args) {
    const inputDir = args[0] || '.';
    const outputDir = args[1] || './react-components';
    
    console.log(colorizer.header('Batch jQuery to React Conversion'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Input Directory: ') + colorizer.bright(inputDir));
    console.log(colorizer.cyan('Output Directory: ') + colorizer.bright(outputDir));
    console.log();

    return this.findJQueryFiles(inputDir)
      .then(files => {
        if (files.length === 0) {
          console.log(colorizer.warning('No jQuery files found\n'));
          return;
        }
        
        console.log(colorizer.info('Found ' + files.length + ' file(s) to convert\n'));
        
        return fs.mkdir(outputDir, { recursive: true })
          .then(() => {
            const promises = files.map(file => {
              const relativePath = path.relative(inputDir, file);
              const outputFile = path.join(
                outputDir,
                relativePath.replace(/\.js$/, '.jsx')
              );
              
              console.log(colorizer.cyan('Converting: ') + relativePath);
              
              return this.convert([file, outputFile])
                .catch(err => {
                  console.log(colorizer.warning('Failed: ' + err.message));
                });
            });
            
            return Promise.all(promises);
          });
      })
      .then(() => {
        console.log(colorizer.success('\nBatch conversion complete!\n'));
      })
      .catch(err => {
        console.log(colorizer.error('Batch conversion failed: ' + err.message + '\n'));
      });
  },

  toPascalCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  },

  toCamelCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toLowerCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  }
};

module.exports = JQueryToReact;