import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, Loader } from 'lucide-react';
import '../assets/css/chat.css';

// Talks to Ollama straight from the browser. It is styled with the terminal's own classes
// (terminal-container, terminal-line, ...), so it looks like the terminal by construction.
export default function AiChatInterface({
    endpoint = 'http://localhost:11434/api/chat',
    model = 'llama2',
}) {
    // type: 'user' | 'ai' | 'info' | 'error'. Only user/ai turns are sent to the model.
    const [messages, setMessages] = useState([
        {
            type: 'info',
            content: `Chat session started (model: ${model}). Enter to send, Shift+Enter for a new line.`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Grow the box with its content (up to the CSS max-height) so Shift+Enter lines are visible
    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [input]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        const userMessage = { type: 'user', content: text, timestamp: new Date() };
        const conversation = [...messages, userMessage]
            .filter(m => m.type === 'user' || m.type === 'ai')
            .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }));

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: conversation,
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`Ollama responded with ${response.status}`);

            const data = await response.json();
            const reply = data.message?.content;
            if (!reply) throw new Error('The model returned an empty response');

            setMessages(prev => [...prev, { type: 'ai', content: reply, timestamp: new Date() }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: `Error: ${error.message}\nMake sure Ollama is running (${endpoint}) and the model "${model}" is pulled.`,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setMessages([]);
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
        <div className="terminal-container">
            {/* Header */}
            <div className="terminal-header">
                <div className="terminal-header-left">
                    <MessageSquare className="terminal-icon" />
                    <span className="terminal-title">FEAR AI Chat</span>
                    <span className="terminal-title" style={{ fontSize: '0.7rem', marginLeft: '1rem', color: '#4ade80' }}>
                        [{model}]
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div
                className="terminal-content"
                onClick={() => inputRef.current?.focus()}
            >
                {messages.map((message, index) => (
                    <div key={index} className="terminal-line">
                        <span className="terminal-timestamp">
                            [{formatTimestamp(message.timestamp)}]
                        </span>
                        {message.type === 'user' ? (
                            <div className="terminal-prompt">
                                <ChevronRight className="terminal-chevron" />
                                <span className="terminal-input-text chat-text">{message.content}</span>
                            </div>
                        ) : message.type === 'error' ? (
                            <span className="terminal-system-text chat-text">{message.content}</span>
                        ) : (
                            <span className="terminal-output-text chat-text">{message.content}</span>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="terminal-processing">
                        <span className="terminal-timestamp">
                            [{formatTimestamp(new Date())}]
                        </span>
                        <Loader className="terminal-loader" />
                        <span className="terminal-processing-text">Thinking...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Line */}
            <div className="terminal-input-container">
                <div className="terminal-input-wrapper chat-input-wrapper">
                    <span className="terminal-timestamp">
                        [{formatTimestamp(new Date())}]
                    </span>
                    <span className="terminal-path">({model})</span>
                    <ChevronRight className="terminal-chevron" />
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                        placeholder="Type your message..."
                        className="terminal-input chat-input"
                        rows="1"
                        autoFocus
                    />
                    {isTyping && (
                        <span className="terminal-cursor">_</span>
                    )}
                </div>
            </div>
        </div>
    );
}