import React from "react";

const Loader = () => {
  return (
    <>
      <div className="main-container">
        <div className="loader">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0a0afe" />
                <stop offset="100%" stopColor="#0f0f0fd4" />
              </linearGradient>

              <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fd0101cd" />
                <stop offset="100%" stopColor="#f50101d3" />
              </linearGradient>

              <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#bbbbbb" />
                <stop offset="50%" stopColor="#888888" />
                <stop offset="100%" stopColor="#555555" />
              </linearGradient>
            </defs>

            <g id="traces">
              <path d="M100 100 H200 V210 H326" className="trace-bg" />
              <path d="M100 100 H200 V210 H326" className="trace-flow purple" />

              <path d="M80 180 H180 V230 H326" className="trace-bg" />
              <path d="M80 180 H180 V230 H326" className="trace-flow blue" />

              <path d="M60 260 H150 V250 H326" className="trace-bg" />
              <path d="M60 260 H150 V250 H326" className="trace-flow yellow" />

              <path d="M100 350 H200 V270 H326" className="trace-bg" />
              <path d="M100 350 H200 V270 H326" className="trace-flow green" />

              <path d="M700 90 H560 V210 H474" className="trace-bg" />
              <path d="M700 90 H560 V210 H474" className="trace-flow blue" />

              <path d="M740 160 H580 V230 H474" className="trace-bg" />
              <path d="M740 160 H580 V230 H474" className="trace-flow green" />

              <path d="M720 250 H590 V250 H474" className="trace-bg" />
              <path d="M720 250 H590 V250 H474" className="trace-flow red" />

              <path d="M680 340 H570 V270 H474" className="trace-bg" />
              <path d="M680 340 H570 V270 H474" className="trace-flow yellow" />
            </g>

            <rect
              x="330"
              y="190"
              width="140"
              height="100"
              rx="20"
              ry="20"
              fill="url(#chipGradient)"
              stroke="#0c0c0c"
              strokeWidth="3"
              filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
            />

            {/* Left Pins */}
            {[205, 225, 245, 265].map((y) => (
              <rect
                key={`l-${y}`}
                x="322"
                y={y}
                width="8"
                height="10"
                fill="url(#pinGradient)"
                rx="2"
              />
            ))}

            {/* Right Pins */}
            {[205, 225, 245, 265].map((y) => (
              <rect
                key={`r-${y}`}
                x="470"
                y={y}
                width="8"
                height="10"
                fill="url(#pinGradient)"
                rx="2"
              />
            ))}

            <text
              x="400"
              y="240"
              fontFamily="Arial, sans-serif"
              fontSize="22"
              fill="url(#textGradient)"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              E-FEAR
            </text>

            {/* Left nodes */}
            {[{ x: 100, y: 100 }, { x: 80, y: 180 }, { x: 60, y: 260 }, { x: 100, y: 350 }].map((c, i) => (
              <circle key={`l-c-${i}`} cx={c.x} cy={c.y} r="5" fill="black" />
            ))}

            {/* Right nodes */}
            {[{ x: 700, y: 90 }, { x: 740, y: 160 }, { x: 720, y: 250 }, { x: 680, y: 340 }].map((c, i) => (
              <circle key={`r-c-${i}`} cx={c.x} cy={c.y} r="5" fill="black" />
            ))}
          </svg>
        </div>
      </div>

      <style>{`
        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          position: fixed;
          background: black;
          z-index: 9999;
          background-image: radial-gradient(circle, #ffffff0f 1px, #0000 0);
    background-size: 22px 22px;
    inset: 0;
    pointer-events: none;
        }

        .loader {
          width: 50%;
          background:transparent
            border-radius:20px;

        }

        .trace-bg {
          stroke: #1f1f1f;
          stroke-width: 1.8;
          fill: none;
        }

        .trace-flow {
          stroke-width: 1.8;
          fill: none;
          stroke-dasharray: 40 400;
          stroke-dashoffset: 438;
          filter: drop-shadow(0 0 6px currentColor);
          animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite;
        }

        .yellow { stroke: #00ff15; color: #00ff15; }
        .blue { stroke: #9900ff; color: #8000ff; }
        .green { stroke: #00ff15; color: #00ff15; }
        .purple { stroke: #9900ff; color: #9900ff; }
        .red { stroke: #9900ff; color: #9900ff; }

        @keyframes flow {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  );
};

export default Loader;