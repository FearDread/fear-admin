
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Loader } from 'lucide-react';

export default function TerminalAgent() {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Agent Terminal v1.0.0', timestamp: new Date() },
    { type: 'output', content: 'Type "help" for available commands', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const simulateAgentResponse = (command) => {
    const responses = {
      help: `Available commands:
  help     - Show this help message
  status   - Check agent status
  run      - Execute a task
  list     - List recent tasks
  clear    - Clear terminal
  info     - Show system information`,
      status: 'Agent Status: READY\nMemory: 45%\nActive Tasks: 0',
      run: 'Starting task execution...\n[OK] Task initialized\n[OK] Processing data\n[OK] Task completed successfully',
      list: 'Recent Tasks:\n1. Data analysis - Completed\n2. File processing - Completed\n3. API integration - In Progress',
      info: 'System Information:\nOS: Linux\nNode: v18.0.0\nAgent Version: 1.0.0\nUptime: 2h 34m',
      clear: null,
    };

    return responses[command] || `Command not found: ${command}\nType "help" for available commands`;
  };

  const handleCommand = async () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    
    // Add command to history
    setHistory(prev => [...prev, { 
      type: 'input', 
      content: cmd, 
      timestamp: new Date() 
    }]);
    
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    setIsProcessing(true);

    // Handle special commands
    if (cmd === 'clear') {
      setHistory([]);
      setIsProcessing(false);
      return;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const baseCommand = cmd.split(' ')[0];
    const response = simulateAgentResponse(baseCommand);

    if (response) {
      // Split multi-line responses
      const lines = response.split('\n');
      for (let i = 0; i < lines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setHistory(prev => [...prev, { 
          type: 'output', 
          content: lines[i], 
          timestamp: new Date() 
        }]);
      }
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-green-400 font-mono">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center gap-3">
        <Terminal className="w-5 h-5" />
        <span className="text-sm">agent@terminal:~$</span>
      </div>

      {/* Terminal Content */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-gray-600 text-xs select-none">
              [{formatTimestamp(entry.timestamp)}]
            </span>
            {entry.type === 'input' ? (
              <div className="flex gap-2 flex-1">
                <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-blue-400">{entry.content}</span>
              </div>
            ) : (
              <span className="text-green-400 flex-1">{entry.content}</span>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-2 items-center">
            <span className="text-gray-600 text-xs">
              [{formatTimestamp(new Date())}]
            </span>
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-yellow-400">Processing...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Input Line */}
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Enter command..."
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-700 disabled:opacity-50"
            autoFocus
          />
          {isProcessing && (
            <span className="text-gray-600 text-sm animate-pulse">_</span>
          )}
        </div>
      </div>
    </div>
  );
}
