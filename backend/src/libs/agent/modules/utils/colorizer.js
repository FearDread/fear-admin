// modules/colorizer.js - Terminal Color Utilities
// Centralized color management for all modules

const Colorizer = function() {
  // ANSI color codes
  this.codes = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    
    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
  };
  
  // Check if colors are disabled
  this.enabled = process.env.NO_COLOR !== '1' && process.stdout.isTTY;
}

Colorizer.prototype = {
  // Color text with specified color
  color(text, color) {
    if (!this.enabled) return text;
    const code = this.codes[color] || this.codes.reset;
    return code + text + this.codes.reset;
  },

  // Predefined color methods
  red(text) {
    return this.color(text, 'red');
  },

  green(text) {
    return this.color(text, 'green');
  },

  yellow(text) {
    return this.color(text, 'yellow');
  },

  blue(text) {
    return this.color(text, 'blue');
  },

  magenta(text) {
    return this.color(text, 'magenta');
  },

  cyan(text) {
    return this.color(text, 'cyan');
  },

  white(text) {
    return this.color(text, 'white');
  },

  gray(text) {
    return this.color(text, 'gray');
  },

  black(text) {
    return this.color(text, 'black');
  },

  bright(text) {
    if (!this.enabled) return text;
    return this.codes.bright + text + this.codes.reset;
  },

  dim(text) {
    if (!this.enabled) return text;
    return this.codes.dim + text + this.codes.reset;
  },

  underscore(text) {
    if (!this.enabled) return text;
    return this.codes.underscore + text + this.codes.reset;
  },

  // Status indicators
  success(text) {
    return this.green('[SUCCESS] ' + text);
  },

  error(text) {
    return this.red('[ERROR] ' + text);
  },

  warning(text) {
    return this.yellow('[WARNING] ' + text);
  },

  info(text) {
    return this.cyan('[INFO] ' + text);
  },

  // Severity levels
  critical(text) {
    return this.bright(this.red('[CRITICAL] ' + text));
  },

  high(text) {
    return this.bright(this.yellow('[HIGH] ' + text));
  },

  medium(text) {
    return this.yellow('[MEDIUM] ' + text);
  },

  low(text) {
    return this.green('[LOW] ' + text);
  },

  // Headers and sections
  header(text) {
    return this.bright(this.cyan('\n' + text));
  },

  subheader(text) {
    return this.cyan(text);
  },

  section(text) {
    return this.bright(this.white('\n' + text));
  },

  // Lists and bullets
  bullet(text) {
    return this.dim('  • ') + text;
  },

  numbered(num, text) {
    return this.dim('  ' + num + '. ') + text;
  },

  // Borders and separators
  separator(char = '═', length = 55) {
    return this.cyan(char.repeat(length));
  },

  box(text, width = 55) {
    const topBottom = this.cyan('═'.repeat(width));
    const lines = text.split('\n');
    const boxed = lines.map(line => {
      const padding = ' '.repeat(Math.max(0, width - line.length - 2));
      return this.cyan('║ ') + line + padding + this.cyan(' ║');
    });
    
    return '\n' + this.cyan('╔') + topBottom + this.cyan('╗') + '\n' +
           boxed.join('\n') + '\n' +
           this.cyan('╚') + topBottom + this.cyan('╝') + '\n';
  },

  // Code highlighting
  code(text) {
    return this.gray(text);
  },

  keyword(text) {
    return this.magenta(text);
  },

  string(text) {
    return this.green(text);
  },

  number(text) {
    return this.blue(text);
  },

  // Links and URLs
  link(text) {
    return this.underscore(this.blue(text));
  },

  // File paths
  path(text) {
    return this.dim(text);
  },

  // Command/action text
  command(text) {
    return this.bright(this.white(text));
  },

  // Progress indicators
  progress(current, total, message) {
    const percentage = Math.floor((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    return this.cyan('[') + this.green(bar) + this.cyan(']') + ' ' + 
           this.bright(percentage + '%') + ' ' + this.dim(message);
  },

  // Table helpers
  tableHeader(text) {
    return this.bright(this.cyan(text));
  },

  tableRow(cells) {
    return cells.map(cell => this.dim('│ ') + cell).join(' ') + this.dim(' │');
  },

  // Background colors
  bgGreen(text) {
    if (!this.enabled) return text;
    return this.codes.bgGreen + text + this.codes.reset;
  },

  bgRed(text) {
    if (!this.enabled) return text;
    return this.codes.bgRed + text + this.codes.reset;
  },

  bgYellow(text) {
    if (!this.enabled) return text;
    return this.codes.bgYellow + text + this.codes.reset;
  },

  bgCyan(text) {
    if (!this.enabled) return text;
    return this.codes.bgCyan + text + this.codes.reset;
  },

  // Status badges
  badge(text, type) {
    const badges = {
      success: this.bgGreen(this.black(' ' + text + ' ')),
      error: this.bgRed(this.white(' ' + text + ' ')),
      warning: this.bgYellow(this.black(' ' + text + ' ')),
      info: this.bgCyan(this.black(' ' + text + ' '))
    };
    return badges[type] || text;
  },

  // Disable colors
  disable() {
    this.enabled = false;
  },

  // Enable colors
  enable() {
    this.enabled = process.stdout.isTTY;
  },

  // Strip colors from text
  strip(text) {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  },

  // Get color code directly
  getCode(colorName) {
    return this.enabled ? (this.codes[colorName] || '') : '';
  },

  getColors() {
    return this.codes;
  }
};


// Create singleton instance
exports.colorizer = new Colorizer();

module.exports = exports.colorizer;