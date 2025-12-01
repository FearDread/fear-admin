// modules/code-refactor.js - JavaScript Code Refactoring Tools
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const CodeRefactor = function () {
  this.refactorPatterns = {
    'class-to-function': this.classToFunction.bind(this),
    'async-to-promise': this.asyncToPromise.bind(this),
    'arrow-functions': this.addArrowFunctions.bind(this),
    'use-this': this.convertToThis.bind(this),
    'modernize': this.modernizeCode.bind(this)
  };

  this.colors = colorizer.getColors();
}

CodeRefactor.prototype = {

  refactorFile(args) {
    const c = this.colors;
    const filePath = args[0];
    const pattern = args[1] || 'modernize';

    if (!filePath) {
      console.log(`
       ` + c.red + `Usage: refactor-file <file-path> [pattern]\n` + c.reset + `
       ` + c.grey + `Available patterns:         
        class-to-function  - Convert class to function constructor
        async-to-promise   - Convert async/await to .then/.catch
        arrow-functions    - Add arrow functions where appropriate
        use-this           - Convert to use "this" keyword
        modernize          - Apply all refactoring patterns\n ` + c.reset + `

        ` + c.cyan + `Examples: ` + c.reset + `
                      ===========
                          refactor-file app.js modernize
                          refactor-file server.js class-to-function\n`);

      return Promise.resolve();
    }

    return fs.readFile(filePath, 'utf8')
      .then(code => {
        console.log(`\nRefactoring JavaScript Code`);
        console.log(`=====================================`);
        console.log(`File: ${filePath}`);
        console.log(`Pattern: ${pattern}`);
        console.log(`Original size: ${code.length} bytes\n`);

        const refactorFunc = this.refactorPatterns[pattern];
        if (!refactorFunc) {
          throw new Error(`Unknown pattern: ${pattern}`);
        }

        const refactored = refactorFunc(code);
        const outputPath = filePath.replace(/\.js$/, '.refactored.js');

        return fs.writeFile(outputPath, refactored)
          .then(() => {
            console.log(`Refactored code saved to: ${outputPath}`);
            console.log(`New size: ${refactored.length} bytes`);
            console.log(`Difference: ${refactored.length - code.length} bytes\n`);

            this.showRefactoringStats(code, refactored);
          });
      })
      .catch(err => {
        console.log(`❌ Refactoring failed: ${err.message}\n`);
      });
  },

  classToFunction(code) {

    console.log('Converting classes to function constructors...\n');
    let refactored = code;
    // Match class declarations
    const classRegex = /class\s+(\w+)\s*\{([^}]+)\}/gs;
    const matches = [...code.matchAll(classRegex)];

    matches.forEach(match => {
      const className = match[1];
      const classBody = match[2];

      // Extract constructor
      const constructorMatch = classBody.match(/constructor\s*\(([^)]*)\)\s*\{([^}]+)\}/s);
      let constructorParams = '';
      let constructorBody = '';

      if (constructorMatch) {
        constructorParams = constructorMatch[1];
        constructorBody = constructorMatch[2];
      }

      // Extract methods
      const methodRegex = /(\w+)\s*\(([^)]*)\)\s*\{([^}]+)\}/gs;
      const methods = [...classBody.matchAll(methodRegex)]
        .filter(m => m[1] !== 'constructor');

      // Build function constructor
      let functionCode = `function ${className}(${constructorParams}) {\n${constructorBody}\n}\n\n`;

      // Add prototype methods
      methods.forEach(method => {
        const methodName = method[1];
        const methodParams = method[2];
        const methodBody = method[3];

        functionCode += `${className}.prototype.${methodName} = function(${methodParams}) {\n${methodBody}\n};\n\n`;
      });

      refactored = refactored.replace(match[0], functionCode);
    });

    return refactored;
  },

  asyncToPromise(code) {

  },

  addArrowFunctions(code) {

  },

  convertToThis(code) {

  },

  modernizeCode(code) {

  }
}
CodeRefactor.prototype.asyncToPromise = function (code) {
  console.log('🔄 Converting async/await to promises...\n');

  let refactored = code;

  // Match async function declarations
  const asyncFuncRegex = /async\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{([^}]+)\}/gs;
  const matches = [...code.matchAll(asyncFuncRegex)];

  matches.forEach(match => {
    const funcName = match[1];
    const params = match[2];
    let body = match[3];

    // Convert await to .then()
    body = body.replace(/const\s+(\w+)\s*=\s*await\s+([^;]+);/g,
      'return $2.then($1 => {');

    body = body.replace(/await\s+/g, '');

    // Add closing braces for .then() chains
    const thenCount = (body.match(/\.then\(/g) || []).length;
    for (let i = 0; i < thenCount; i++) {
      body += '\n  })';
    }

    // Add .catch() at the end
    if (body.includes('.then(')) {
      body += '\n  .catch(err => {\n    console.error(err);\n  })';
    }

    const newFunc = `function ${funcName}(${params}) {\n${body}\n}`;
    refactored = refactored.replace(match[0], newFunc);
  });

  // Convert async arrow functions
  refactored = refactored.replace(
    /async\s*\(([^)]*)\)\s*=>\s*\{/g,
    '($1) => {'
  );

  // Convert try/catch to .catch()
  refactored = refactored.replace(
    /try\s*\{([^}]+)\}\s*catch\s*\(([^)]+)\)\s*\{([^}]+)\}/gs,
    (match, tryBlock, errorVar, catchBlock) => {
      return `Promise.resolve().then(() => {\n${tryBlock}\n}).catch(${errorVar} => {\n${catchBlock}\n})`;
    }
  );

  return refactored;
};

CodeRefactor.prototype.addArrowFunctions = function (code) {
  console.log('🔄 Adding arrow functions...\n');

  let refactored = code;

  // Convert simple callbacks to arrow functions
  refactored = refactored.replace(
    /function\s*\(([^)]*)\)\s*\{(\s*return\s+[^;]+;?\s*)\}/g,
    '($1) => $2'
  );

  // Convert .then(function() {}) to .then(() => {})
  refactored = refactored.replace(
    /\.then\(function\s*\(([^)]*)\)\s*\{/g,
    '.then(($1) => {'
  );

  // Convert .catch(function() {}) to .catch(() => {})
  refactored = refactored.replace(
    /\.catch\(function\s*\(([^)]*)\)\s*\{/g,
    '.catch(($1) => {'
  );

  // Convert .map, .filter, .forEach callbacks
  ['map', 'filter', 'forEach', 'reduce', 'find', 'some', 'every'].forEach(method => {
    const regex = new RegExp(`\\.${method}\\(function\\s*\\(([^)]*)\\)\\s*\\{`, 'g');
    refactored = refactored.replace(regex, `.${method}(($1) => {`);
  });

  return refactored;
};

CodeRefactor.prototype.convertToThis = function (code) {
  console.log('🔄 Converting to use "this" keyword...\n');

  let refactored = code;

  // Find const declarations at module level that could be instance properties
  const constRegex = /const\s+(\w+)\s*=\s*([^;]+);/g;
  const consts = [...code.matchAll(constRegex)];

  // This is a simple conversion - in practice, you'd need more context
  consts.forEach(match => {
    const varName = match[1];
    const value = match[2];

    // Skip certain patterns
    if (value.includes('require(') || value.includes('import ')) {
      return;
    }

    // Convert to this.property
    refactored = refactored.replace(
      new RegExp(`\\b${varName}\\b(?!:)`, 'g'),
      `this.${varName}`
    );
  });

  return refactored;
};

CodeRefactor.prototype.modernizeCode = function (code) {
  console.log('🔄 Applying all modernization patterns...\n');

  let refactored = code;

  // Apply all refactoring patterns in sequence
  refactored = this.classToFunction(refactored);
  refactored = this.asyncToPromise(refactored);
  refactored = this.addArrowFunctions(refactored);

  // Additional modernizations

  // Convert var to const/let
  refactored = refactored.replace(/\bvar\b/g, 'const');

  // Convert string concatenation to template literals (simple cases)
  refactored = refactored.replace(
    /'([^']+)'\s*\+\s*(\w+)\s*\+\s*'([^']+)'/g,
    '`$1${$2}$3`'
  );

  // Convert callback hell to promise chains (simple pattern)
  refactored = this.flattenCallbacks(refactored);

  // Remove semicolons (optional style)
  // refactored = refactored.replace(/;$/gm, '');

  return refactored;
};

CodeRefactor.prototype.flattenCallbacks = function (code) {
  // This is a simplified version - full callback flattening is complex
  // Look for nested callbacks and suggest promise chains

  let refactored = code;

  // Convert nested callbacks to promise chains
  const nestedCallbackPattern = /(\w+)\(([^,]+),\s*function\s*\(([^)]*)\)\s*\{([^}]+)(\w+)\(([^,]+),\s*function/gs;

  if (nestedCallbackPattern.test(code)) {
    console.log('  ⚠️  Detected nested callbacks - consider refactoring to promises');
  }

  return refactored;
};

CodeRefactor.prototype.showRefactoringStats = function (original, refactored) {
  console.log('📊 Refactoring Statistics:');

  const stats = {
    originalLines: original.split('\n').length,
    refactoredLines: refactored.split('\n').length,
    classKeywords: (original.match(/\bclass\b/g) || []).length,
    functionConstructors: (refactored.match(/function\s+\w+\s*\(/g) || []).length,
    asyncKeywords: (original.match(/\basync\b/g) || []).length,
    promiseChains: (refactored.match(/\.then\(/g) || []).length,
    arrowFunctions: (refactored.match(/=>/g) || []).length,
    thisKeywords: (refactored.match(/\bthis\./g) || []).length
  };

  console.log(`  Lines: ${stats.originalLines} → ${stats.refactoredLines}`);
  console.log(`  Classes: ${stats.classKeywords} → 0`);
  console.log(`  Function constructors: ${stats.functionConstructors}`);
  console.log(`  Async/await: ${stats.asyncKeywords} → 0`);
  console.log(`  Promise chains: ${stats.promiseChains}`);
  console.log(`  Arrow functions: ${stats.arrowFunctions}`);
  console.log(`  "this" references: ${stats.thisKeywords}\n`);
};

CodeRefactor.prototype.refactorProject = function (args) {
  const dir = args[0] || '.';
  const pattern = args[1] || 'modernize';

  console.log(`\n🔧 Refactoring Project`);
  console.log(`═══════════════════════════════════════`);
  console.log(`Directory: ${dir}`);
  console.log(`Pattern: ${pattern}\n`);

  return this.findJSFiles(dir)
    .then(files => {
      console.log(`Found ${files.length} JavaScript files\n`);

      const refactorPromises = files.map(file => {
        return this.refactorFile([file, pattern])
          .catch(err => {
            console.log(`⚠️  Failed to refactor ${file}: ${err.message}`);
          });
      });

      return Promise.all(refactorPromises);
    })
    .then(() => {
      console.log('\n✅ Project refactoring complete!\n');
    })
    .catch(err => {
      console.log(`❌ Project refactoring failed: ${err.message}\n`);
    });
};

CodeRefactor.prototype.findJSFiles = function (dir, files = []) {
  return fs.readdir(dir)
    .then(items => {
      const promises = items.map(item => {
        const fullPath = path.join(dir, item);

        // Skip common directories
        if (['node_modules', '.git', 'dist', 'build'].includes(item)) {
          return Promise.resolve();
        }

        return fs.stat(fullPath)
          .then(stat => {
            if (stat.isDirectory()) {
              return this.findJSFiles(fullPath, files);
            } else if (['.js', '.mjs', '.cjs'].includes(path.extname(fullPath))) {
              files.push(fullPath);
            }
          })
          .catch(() => {
            // Skip files we can't read
          });
      });

      return Promise.all(promises);
    })
    .then(() => files)
    .catch(() => files);
};

CodeRefactor.prototype.analyzeCode = function (args) {
  const filePath = args[0];

  if (!filePath) {
    console.log('❌ Usage: analyze-refactor <file-path>\n');
    return Promise.resolve();
  }

  return fs.readFile(filePath, 'utf8')
    .then(code => {
      console.log(`\n📊 Code Analysis for Refactoring`);
      console.log(`═══════════════════════════════════════`);
      console.log(`File: ${filePath}\n`);

      const analysis = {
        totalLines: code.split('\n').length,
        codeLines: code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length,
        hasClasses: code.includes('class '),
        hasAsyncAwait: code.includes('async ') || code.includes('await '),
        hasArrowFunctions: code.includes('=>'),
        hasPromises: code.includes('.then(') || code.includes('.catch('),
        hasThis: code.includes('this.'),
        hasVar: code.includes('var '),
        hasLet: code.includes('let '),
        hasConst: code.includes('const '),
        nestedCallbacks: (code.match(/function\s*\([^)]*\)\s*\{[^}]*function\s*\(/g) || []).length
      };

      console.log('Current Code Style:');
      console.log(`  Total lines: ${analysis.totalLines}`);
      console.log(`  Code lines: ${analysis.codeLines}`);
      console.log(`  Uses classes: ${analysis.hasClasses ? '✅' : '❌'}`);
      console.log(`  Uses async/await: ${analysis.hasAsyncAwait ? '✅' : '❌'}`);
      console.log(`  Uses arrow functions: ${analysis.hasArrowFunctions ? '✅' : '❌'}`);
      console.log(`  Uses promises: ${analysis.hasPromises ? '✅' : '❌'}`);
      console.log(`  Uses "this": ${analysis.hasThis ? '✅' : '❌'}`);
      console.log(`  Uses var: ${analysis.hasVar ? '⚠️' : '✅'}`);
      console.log(`  Uses let/const: ${analysis.hasLet || analysis.hasConst ? '✅' : '❌'}`);
      console.log(`  Nested callbacks: ${analysis.nestedCallbacks}\n`);

      console.log('Recommended Refactoring:');
      const recommendations = [];

      if (analysis.hasClasses) {
        recommendations.push('  • class-to-function - Convert classes to function constructors');
      }
      if (analysis.hasAsyncAwait) {
        recommendations.push('  • async-to-promise - Convert async/await to promise chains');
      }
      if (!analysis.hasArrowFunctions) {
        recommendations.push('  • arrow-functions - Add arrow functions for callbacks');
      }
      if (!analysis.hasThis && analysis.hasClasses) {
        recommendations.push('  • use-this - Convert to use "this" keyword');
      }
      if (analysis.hasVar) {
        recommendations.push('  • modernize - Replace var with const/let');
      }
      if (analysis.nestedCallbacks > 2) {
        recommendations.push('  • async-to-promise - Flatten callback hell');
      }

      if (recommendations.length === 0) {
        console.log('  ✅ Code follows recommended patterns!\n');
      } else {
        recommendations.forEach(rec => console.log(rec));
        console.log('\nRun: refactor-file ' + filePath + ' modernize\n');
      }
    })
    .catch(err => {
      console.log(`❌ Analysis failed: ${err.message}\n`);
    });
};

CodeRefactor.prototype.compareVersions = function (args) {
  const originalPath = args[0];
  const refactoredPath = args[1];

  if (!originalPath || !refactoredPath) {
    console.log('❌ Usage: compare-refactor <original-file> <refactored-file>\n');
    return Promise.resolve();
  }

  return Promise.all([
    fs.readFile(originalPath, 'utf8'),
    fs.readFile(refactoredPath, 'utf8')
  ])
    .then(([original, refactored]) => {
      console.log(`\n📊 Refactoring Comparison`);
      console.log(`═══════════════════════════════════════`);
      console.log(`Original: ${originalPath}`);
      console.log(`Refactored: ${refactoredPath}\n`);

      this.showRefactoringStats(original, refactored);

      console.log('Changes Summary:');
      const changes = [];

      if (original.includes('class ') && !refactored.includes('class ')) {
        changes.push('  ✅ Converted classes to function constructors');
      }
      if (original.includes('async ') && !refactored.includes('async ')) {
        changes.push('  ✅ Converted async/await to promises');
      }
      if ((refactored.match(/=>/g) || []).length > (original.match(/=>/g) || []).length) {
        changes.push('  ✅ Added arrow functions');
      }
      if ((refactored.match(/this\./g) || []).length > (original.match(/this\./g) || []).length) {
        changes.push('  ✅ Added "this" keyword usage');
      }

      if (changes.length > 0) {
        changes.forEach(change => console.log(change));
      } else {
        console.log('  ℹ️  No significant changes detected');
      }
      console.log();
    })
    .catch(err => {
      console.log(`❌ Comparison failed: ${err.message}\n`);
    });
};

module.exports = CodeRefactor;