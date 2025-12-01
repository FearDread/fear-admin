

const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const FileBrowser = function () {
    this.currentPath = process.cwd();
    this.bookmarks = new Map();
    this.history = [];
    this.historyIndex = -1;
}

FileBrowser.prototype = {
    // List files and directories
    async list(args) {
        const targetPath = args.length > 0 ? args.join(' ') : this.currentPath;
        const fullPath = path.resolve(this.currentPath, targetPath);

        try {
            const stats = await fs.stat(fullPath);

            if (!stats.isDirectory()) {
                console.log(colorizer.error('Not a directory: ' + fullPath));
                return;
            }

            const items = await fs.readdir(fullPath, { withFileTypes: true });

            console.log(colorizer.section('📁 Directory Listing'));
            console.log(colorizer.cyan('  Current Path: ') + colorizer.bright(fullPath));
            console.log(colorizer.dim('  ' + '='.repeat(70)));
            console.log();

            // Sort: directories first, then files
            const dirs = items.filter(item => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
            const files = items.filter(item => !item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));

            // Display directories
            for (const dir of dirs) {
                const itemPath = path.join(fullPath, dir.name);
                const stats = await fs.stat(itemPath);
                const modified = stats.mtime.toLocaleDateString();

                console.log(colorizer.cyan('  📁 ' + dir.name.padEnd(40)) +
                    colorizer.dim(modified.padEnd(15) + '<DIR>'));
            }

            // Display files
            for (const file of files) {
                const itemPath = path.join(fullPath, file.name);
                const stats = await fs.stat(itemPath);
                const size = this.formatSize(stats.size);
                const modified = stats.mtime.toLocaleDateString();
                const icon = this.getFileIcon(file.name);

                console.log(colorizer.bright('  ' + icon + ' ' + file.name.padEnd(40)) +
                    colorizer.dim(modified.padEnd(15) + size.padStart(10)));
            }

            console.log();
            console.log(colorizer.dim('  Total: ' + dirs.length + ' directories, ' + files.length + ' files'));
            console.log();

        } catch (err) {
            console.log(colorizer.error('Error listing directory: ' + err.message));
        }
    },

    // Change directory
    async cd(args) {
        if (args.length === 0) {
            console.log(colorizer.cyan('Current directory: ') + this.currentPath);
            return;
        }

        const targetPath = args.join(' ');
        let newPath;

        // Handle special cases
        if (targetPath === '..') {
            newPath = path.dirname(this.currentPath);
        } else if (targetPath === '~' || targetPath === '$HOME') {
            newPath = require('os').homedir();
        } else if (targetPath === '-') {
            // Go back in history
            if (this.history.length > 0 && this.historyIndex > 0) {
                this.historyIndex--;
                newPath = this.history[this.historyIndex];
            } else {
                console.log(colorizer.warning('No previous directory in history'));
                return;
            }
        } else {
            newPath = path.resolve(this.currentPath, targetPath);
        }

        try {
            const stats = await fs.stat(newPath);

            if (!stats.isDirectory()) {
                console.log(colorizer.error('Not a directory: ' + newPath));
                return;
            }

            // Update history
            if (targetPath !== '-') {
                this.history = this.history.slice(0, this.historyIndex + 1);
                this.history.push(newPath);
                this.historyIndex = this.history.length - 1;
            }

            this.currentPath = newPath;
            console.log(colorizer.green('Changed to: ') + colorizer.bright(this.currentPath));

            // Auto-list after cd
            await this.list([]);

        } catch (err) {
            console.log(colorizer.error('Error changing directory: ' + err.message));
        }
    },

    // Display current path
    pwd() {
        console.log(colorizer.section('📍 Current Working Directory'));
        console.log(colorizer.bright('  ' + this.currentPath));
        console.log();
        return Promise.resolve();
    },

    // View file contents
    async cat(args) {
        if (args.length === 0) {
            console.log(colorizer.error('Usage: cat <filename>'));
            return;
        }

        const filename = args.join(' ');
        const fullPath = path.resolve(this.currentPath, filename);

        try {
            const stats = await fs.stat(fullPath);

            if (stats.isDirectory()) {
                console.log(colorizer.error('Cannot display directory contents. Use "ls" instead.'));
                return;
            }

            const content = await fs.readFile(fullPath, 'utf8');
            const lines = content.split('\n');

            console.log(colorizer.section('📄 File: ' + path.basename(fullPath)));
            console.log(colorizer.cyan('  Path: ') + colorizer.dim(fullPath));
            console.log(colorizer.cyan('  Size: ') + colorizer.dim(this.formatSize(stats.size)));
            console.log(colorizer.cyan('  Lines: ') + colorizer.dim(lines.length));
            console.log(colorizer.dim('  ' + '='.repeat(70)));
            console.log();

            // Display with line numbers
            lines.forEach((line, i) => {
                const lineNum = String(i + 1).padStart(4, ' ');
                console.log(colorizer.dim(lineNum + ' │ ') + line);
            });

            console.log();

        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log(colorizer.error('File not found: ' + fullPath));
            } else {
                console.log(colorizer.error('Error reading file: ' + err.message));
            }
        }
    },

    // View file with pagination
    async less(args) {
        if (args.length === 0) {
            console.log(colorizer.error('Usage: less <filename>'));
            return;
        }

        const filename = args.join(' ');
        const fullPath = path.resolve(this.currentPath, filename);

        try {
            const content = await fs.readFile(fullPath, 'utf8');
            const lines = content.split('\n');
            const pageSize = 30;

            console.log(colorizer.section('📄 File: ' + path.basename(fullPath)));
            console.log(colorizer.dim('  Showing first ' + Math.min(pageSize, lines.length) + ' of ' + lines.length + ' lines'));
            console.log(colorizer.dim('  ' + '='.repeat(70)));
            console.log();

            // Display first page
            const firstPage = lines.slice(0, pageSize);
            firstPage.forEach((line, i) => {
                const lineNum = String(i + 1).padStart(4, ' ');
                console.log(colorizer.dim(lineNum + ' │ ') + line);
            });

            if (lines.length > pageSize) {
                console.log();
                console.log(colorizer.dim('  ... ' + (lines.length - pageSize) + ' more lines'));
                console.log(colorizer.info('  Tip: Use "cat ' + filename + '" to view entire file'));
            }

            console.log();

        } catch (err) {
            console.log(colorizer.error('Error reading file: ' + err.message));
        }
    },

    // Search for files
    async find(args) {
        if (args.length === 0) {
            console.log(colorizer.error('Usage: find <pattern>'));
            return;
        }

        const pattern = args.join(' ').toLowerCase();
        const results = [];

        console.log(colorizer.section('🔍 Searching for: ' + pattern));
        console.log(colorizer.dim('  Starting from: ' + this.currentPath));
        console.log();

        await this.searchRecursive(this.currentPath, pattern, results, 0);

        if (results.length === 0) {
            console.log(colorizer.warning('  No matches found'));
        } else {
            console.log(colorizer.green('  Found ' + results.length + ' matches:'));
            console.log();

            results.forEach(result => {
                const relPath = path.relative(this.currentPath, result.path);
                const icon = result.isDir ? '📁' : this.getFileIcon(result.name);
                console.log(colorizer.bright('  ' + icon + ' ' + relPath));
            });
        }

        console.log();
    },

    // Recursive search helper
    async searchRecursive(dir, pattern, results, depth) {
        if (depth > 5) return; // Limit recursion depth

        try {
            const items = await fs.readdir(dir, { withFileTypes: true });

            for (const item of items) {
                // Skip hidden files and node_modules
                if (item.name.startsWith('.') || item.name === 'node_modules') continue;

                const fullPath = path.join(dir, item.name);

                if (item.name.toLowerCase().includes(pattern)) {
                    results.push({
                        path: fullPath,
                        name: item.name,
                        isDir: item.isDirectory()
                    });
                }

                if (item.isDirectory() && results.length < 100) {
                    await this.searchRecursive(fullPath, pattern, results, depth + 1);
                }
            }
        } catch (err) {
            // Skip directories we can't access
        }
    },

    // File information
    async info(args) {
        if (args.length === 0) {
            console.log(colorizer.error('Usage: file-info <filename>'));
            return;
        }

        const filename = args.join(' ');
        const fullPath = path.resolve(this.currentPath, filename);

        try {
            const stats = await fs.stat(fullPath);

            console.log(colorizer.section('ℹ️  File Information'));
            console.log(colorizer.cyan('  Name: ') + colorizer.bright(path.basename(fullPath)));
            console.log(colorizer.cyan('  Path: ') + colorizer.dim(fullPath));
            console.log(colorizer.cyan('  Type: ') + (stats.isDirectory() ? 'Directory' : 'File'));
            console.log(colorizer.cyan('  Size: ') + this.formatSize(stats.size));
            console.log(colorizer.cyan('  Created: ') + stats.birthtime.toLocaleString());
            console.log(colorizer.cyan('  Modified: ') + stats.mtime.toLocaleString());
            console.log(colorizer.cyan('  Accessed: ') + stats.atime.toLocaleString());

            // File extension and type
            if (!stats.isDirectory()) {
                const ext = path.extname(fullPath).toLowerCase();
                console.log(colorizer.cyan('  Extension: ') + (ext || 'none'));
                console.log(colorizer.cyan('  Mime Type: ') + this.getMimeType(ext));
            }

            console.log();

        } catch (err) {
            console.log(colorizer.error('Error getting file info: ' + err.message));
        }
    },

    // Tree view
    async tree(args) {
        const maxDepth = args.length > 0 ? parseInt(args[0]) : 2;

        console.log(colorizer.section('🌲 Directory Tree'));
        console.log(colorizer.cyan('  ' + this.currentPath));
        console.log();

        await this.printTree(this.currentPath, '', maxDepth, 0);
        console.log();
    },

    async printTree(dir, prefix, maxDepth, currentDepth) {
        if (currentDepth >= maxDepth) return;

        try {
            const items = await fs.readdir(dir, { withFileTypes: true });
            const filtered = items.filter(item => !item.name.startsWith('.') && item.name !== 'node_modules');

            for (let i = 0; i < filtered.length; i++) {
                const item = filtered[i];
                const isLast = i === filtered.length - 1;
                const connector = isLast ? '└── ' : '├── ';
                const icon = item.isDirectory() ? '📁' : this.getFileIcon(item.name);

                console.log(prefix + connector + icon + ' ' + item.name);

                if (item.isDirectory()) {
                    const newPrefix = prefix + (isLast ? '    ' : '│   ');
                    const fullPath = path.join(dir, item.name);
                    await this.printTree(fullPath, newPrefix, maxDepth, currentDepth + 1);
                }
            }
        } catch (err) {
            // Skip directories we can't access
        }
    },

    // Bookmarks
    bookmark(args) {
        if (args.length === 0) {
            // List bookmarks
            console.log(colorizer.section('🔖 Bookmarks'));

            if (this.bookmarks.size === 0) {
                console.log(colorizer.dim('  No bookmarks saved'));
            } else {
                for (const [name, path] of this.bookmarks) {
                    console.log(colorizer.cyan('  ' + name.padEnd(20)) + colorizer.dim(path));
                }
            }
            console.log();
            return Promise.resolve();
        }

        const name = args[0];

        if (args.length === 1) {
            // Jump to bookmark
            if (this.bookmarks.has(name)) {
                const bookmarkedPath = this.bookmarks.get(name);
                return this.cd([bookmarkedPath]);
            } else {
                console.log(colorizer.error('Bookmark not found: ' + name));
                return Promise.resolve();
            }
        } else {
            // Save bookmark
            const targetPath = args.slice(1).join(' ');
            const fullPath = path.resolve(this.currentPath, targetPath);

            this.bookmarks.set(name, fullPath);
            console.log(colorizer.green('Bookmark saved: ') + colorizer.cyan(name) + ' → ' + fullPath);
            console.log();
            return Promise.resolve();
        }
    },

    // Show help
    showHelp() {
        console.log(colorizer.section('📁 File Browser Commands'));
        console.log();

        const commands = [
            ['ls [path]', 'List files and directories'],
            ['cd <path>', 'Change directory (.. for parent, ~ for home, - for previous)'],
            ['pwd', 'Show current directory'],
            ['cat <file>', 'Display file contents with line numbers'],
            ['less <file>', 'View first 30 lines of file'],
            ['find <pattern>', 'Search for files by name'],
            ['file-info <file>', 'Show detailed file information'],
            ['tree [depth]', 'Display directory tree (default depth: 2)'],
            ['bookmark [name] [path]', 'Save/jump to bookmarks'],
            ['browse-help', 'Show this help']
        ];

        commands.forEach(([cmd, desc]) => {
            console.log(colorizer.cyan('  ' + cmd.padEnd(25)) + colorizer.dim(desc));
        });

        console.log();
        console.log(colorizer.info('Examples:'));
        console.log(colorizer.dim('  ls ../src          # List parent src directory'));
        console.log(colorizer.dim('  cd ~/projects      # Go to home projects folder'));
        console.log(colorizer.dim('  find server.js     # Find all files matching "server.js"'));
        console.log(colorizer.dim('  tree 3             # Show tree with depth 3'));
        console.log(colorizer.dim('  bookmark proj .    # Save current dir as "proj"'));
        console.log(colorizer.dim('  bookmark proj      # Jump to "proj" bookmark'));
        console.log();

        return Promise.resolve();
    },

    // Helper: Format file size
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Helper: Get file icon
    getFileIcon(filename) {
        const ext = path.extname(filename).toLowerCase();
        const icons = {
            '.js': '📜',
            '.json': '📋',
            '.md': '📝',
            '.txt': '📄',
            '.html': '🌐',
            '.css': '🎨',
            '.png': '🖼️',
            '.jpg': '🖼️',
            '.jpeg': '🖼️',
            '.gif': '🖼️',
            '.svg': '🎨',
            '.pdf': '📕',
            '.zip': '📦',
            '.tar': '📦',
            '.gz': '📦',
            '.mp3': '🎵',
            '.mp4': '🎬',
            '.py': '🐍',
            '.java': '☕',
            '.cpp': '⚙️',
            '.c': '⚙️',
            '.sh': '💻',
            '.yml': '⚙️',
            '.yaml': '⚙️',
            '.xml': '📰',
            '.sql': '🗄️'
        };
        return icons[ext] || '📄';
    },

    // Helper: Get MIME type
    getMimeType(ext) {
        const types = {
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.html': 'text/html',
            '.css': 'text/css',
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.zip': 'application/zip'
        };
        return types[ext] || 'application/octet-stream';
    }
}

module.exports = FileBrowser;