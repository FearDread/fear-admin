import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, MessageSquare } from 'lucide-react';
import SecurityAgentTerminal from './terminal';
import AiChatInterface from './chat';
import '../assets/css/console.css';

const TABS = [
    { id: 'terminal', label: 'Terminal', Icon: TerminalIcon },
    { id: 'chat', label: 'AI Chat', Icon: MessageSquare },
];

// Hosts the terminal and the chat side by side or as tabs. The two components don't know about each
// other, and both stay mounted, so switching tabs keeps their history (and the terminal's session).
export default function AgentConsole() {
    const [active, setActive] = useState('terminal');
    const [split, setSplit] = useState(false);
    const panes = { terminal: useRef(null), chat: useRef(null) };

    // Put the cursor in whichever pane was just brought to the front
    useEffect(() => {
        if (!split) panes[active].current?.querySelector('.terminal-input')?.focus();

    }, [active, split]);

    const isVisible = (id) => split || active === id;

    return (
        <div className={`agent-console ${split ? 'is-split' : ''}`}>
            <div className="terminal-header agent-console-bar">
                <div className="agent-console-tabs" role="tablist">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={!split && active === id}
                            disabled={split}
                            className={`agent-console-tab ${!split && active === id ? 'is-active' : ''}`}
                            onClick={() => setActive(id)}
                        >
                            <Icon className="terminal-icon" />
                            {label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="agent-console-toggle"
                    onClick={() => setSplit(prev => !prev)}
                    title={split ? 'Show one panel at a time' : 'Show both panels'}
                >
                    {split ? 'Tabs' : 'Split'}
                </button>
            </div>

            <div className="agent-console-panes">
                <section ref={panes.terminal} className="agent-console-pane" hidden={!isVisible('terminal')}>
                    <SecurityAgentTerminal />
                </section>
                <section ref={panes.chat} className="agent-console-pane" hidden={!isVisible('chat')}>
                    <AiChatInterface />
                </section>
            </div>
        </div>
    );
}