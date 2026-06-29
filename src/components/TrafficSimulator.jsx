import { useState } from 'react'
import { TRAFFIC_FLOWS } from '../data/concepts'

export default function TrafficSimulator() {
  const [activeFlow, setActiveFlow] = useState(TRAFFIC_FLOWS[0])

  return (
    <div className="traffic-wrap">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 5l3 3-3 3" stroke="#7c6ff7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Traffic Flow Simulator
        </div>
        <p className="card-subtitle">
          Select a communication pattern to see how Raven routes packets across regions.
        </p>

        <div className="flow-selector">
          {TRAFFIC_FLOWS.map((f) => (
            <button
              key={f.id}
              className={`flow-btn ${activeFlow.id === f.id ? 'active' : ''}`}
              onClick={() => setActiveFlow(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#c9cdd7', marginBottom: 16, lineHeight: 1.6 }}>
          {activeFlow.description}
        </div>

        <div className="flow-steps">
          {activeFlow.steps.map((step, i) => (
            <div
              key={i}
              className="flow-step"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="step-num">{i + 1}</div>
              <div className="step-text">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual flow diagram */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-title">Visual Flow</div>
        <svg viewBox="0 0 800 260" style={{ width: '100%' }}>
          {/* Background regions */}
          <rect x="20" y="20" width="220" height="220" rx="10" fill="#0d1018" stroke="#1a2030" />
          <text x="130" y="40" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {activeFlow.id === 'cloud-edge-l7' ? 'CLOUD' : 'SOURCE'}
          </text>

          <rect x="540" y="20" width="220" height="220" rx="10" fill="#0d1018" stroke="#1a2030" />
          <text x="650" y="40" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {activeFlow.id === 'cloud-edge-l7' ? 'EDGE (NAT)' : 'TARGET'}
          </text>

          {/* Source pod */}
          <g transform={`translate(80, ${activeFlow.id === 'cloud-edge-l7' ? 70 : 80})`}>
            <rect x="0" y="0" width="100" height="50" rx="8" fill="#111520" stroke="#2a2640" strokeWidth="1" />
            <text x="50" y="22" fill="#c9cdd7" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'kubectl' : 'Pod A'}
            </text>
            <text x="50" y="38" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'logs/exec/attach' : '10.244.1.5'}
            </text>
          </g>

          {/* Source gateway */}
          <g transform="translate(70, 160)">
            <rect x="0" y="0" width="120" height="50" rx="8" fill="#13172a" stroke="#7c6ff740" strokeWidth="1" />
            <text x="60" y="22" fill="#7c6ff7" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Gateway</text>
            <text x="60" y="38" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'L7 Proxy' : 'VPN endpoint'}
            </text>
          </g>

          {/* Arrow source pod → source gateway */}
          <line x1="130" y1={activeFlow.id === 'cloud-edge-l7' ? 120 : 130} x2="130" y2="160" stroke="#1a2030" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="128,157 130,162 132,157" fill="#1a2030" />

          {/* Tunnel line */}
          <line x1="190" y1="185" x2="540" y2="185" stroke="#5ab8db" strokeWidth="2" opacity="0.6" />
          <line x1="190" y1="185" x2="540" y2="185" stroke="#5ab8db" strokeWidth="4" strokeDasharray="6 10" opacity="0.3">
            <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1s" repeatCount="indefinite" />
          </line>
          <text x="365" y="175" fill="#5ab8db" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace" opacity="0.8">
            {activeFlow.id === 'cloud-edge-l7' ? 'L7 Reverse Channel' : 'IPsec / WireGuard'}
          </text>

          {/* Target gateway */}
          <g transform="translate(590, 160)">
            <rect x="0" y="0" width="120" height="50" rx="8" fill="#13172a" stroke="#7c6ff740" strokeWidth="1" />
            <text x="60" y="22" fill="#7c6ff7" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Gateway</text>
            <text x="60" y="38" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'NAT traversal' : 'VPN endpoint'}
            </text>
          </g>

          {/* Target pod */}
          <g transform={`translate(600, ${activeFlow.id === 'cloud-edge-l7' ? 70 : 80})`}>
            <rect x="0" y="0" width="100" height="50" rx="8" fill="#111520" stroke="#2a2640" strokeWidth="1" />
            <text x="50" y="22" fill="#c9cdd7" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'Target Node' : 'Pod B'}
            </text>
            <text x="50" y="38" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {activeFlow.id === 'cloud-edge-l7' ? 'nodeName+port' : '10.244.2.8'}
            </text>
          </g>

          {/* Arrow target gateway → target pod */}
          <line x1="650" y1="160" x2="650" y2={activeFlow.id === 'cloud-edge-l7' ? 120 : 130} stroke="#1a2030" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="648,133 650,128 652,133" fill="#1a2030" />

          {/* Animated packet */}
          <circle r="4" fill="#e8eaf0" opacity="0.9">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M130 130 Q 250 100, 365 185 Q 480 270, 650 185" />
          </circle>
        </svg>
      </div>
    </div>
  )
}
