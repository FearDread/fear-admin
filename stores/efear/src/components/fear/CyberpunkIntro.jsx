import { useEffect, useState } from "react";

const lines = [
  "Initializing system...",
  "Injecting payload...",
  "Accessing EFEAR database...",
  "WARNING: Unauthorized access detected",
  "Overriding...",
  "ACCESS GRANTED"
];

export default function CyberpunkIntro({ onFinish }) {
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  // typing effect
  useEffect(() => {
    if (currentLine >= lines.length) {
      setTimeout(() => {
        setDone(true);
        onFinish && onFinish();
      }, 1200);
      return;
    }

    let i = 0;
    const text = lines[currentLine];

    const typing = setInterval(() => {
      setTyped(text.slice(0, i));
      i++;

      if (i > text.length) {
        clearInterval(typing);
        setDisplayed(prev => [...prev, text]);
        setTyped("");
        setCurrentLine(prev => prev + 1);
      }
    }, 25 + Math.random() * 40);

    return () => clearInterval(typing);
  }, [currentLine]);

  if (done) return null;

  return (
    <div className="terminal-container">
      <div className="terminal">
        {displayed.map((line, i) => (
          <div key={i} className="line">{"> " + line}</div>
        ))}

        {currentLine < lines.length && (
          <div className="line">
            {"> " + typed}
            <span className="cursor" />
          </div>
        )}
      </div>

      <div className="glitch-overlay" />

      <style>{`
        .terminal-container {
          position: fixed;
          inset: 0;
          background: #000;
          color: #ff1a1a;
          font-family: monospace;
          padding: 40px;
          z-index: 9999;
          overflow: hidden;
          animation: fadeOut 1s ease forwards;
          animation-delay: 4.5s;
        }

        .terminal {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .line {
          margin-bottom: 6px;
          text-shadow: 0 0 6px #ff1a1a;
        }

        .cursor {
          display: inline-block;
          width: 10px;
          height: 18px;
          background: #ff1a1a;
          margin-left: 5px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }

        /* glitch overlay */
        .glitch-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,0,0,0.05),
            rgba(255,0,0,0.05) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: glitchMove 0.2s infinite;
          pointer-events: none;
        }

        @keyframes glitchMove {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }

        /* screen flicker */
        .terminal-container::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255,0,0,0.03);
          animation: flicker 0.15s infinite;
          pointer-events: none;
        }

        @keyframes flicker {
          0% { opacity: 0.05; }
          50% { opacity: 0.2; }
          100% { opacity: 0.05; }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}