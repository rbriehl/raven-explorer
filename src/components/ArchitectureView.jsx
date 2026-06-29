import { useState } from 'react'
import { Server, Activity, FileCode, Layers, Shield, Globe, ArrowRight } from 'lucide-react'

const COMPONENTS = [
  {
    id: 'yurt-manager',
    title: 'Yurt Manager',
    subtitle: 'Control Plane — Deployment in Cloud',
    icon: Server,
    color: '#5cdb8a',
    desc: 'Monitors edge node pools and elects a gateway node for each region. Publishes Gateway CRD status.',
  },
  {
    id: 'gateway-crd',
    title: 'Gateway CRD',
    subtitle: 'API Resource',
    icon: FileCode,
    color: '#db5a8a',
    desc: 'Connects controller and agents. One Gateway per node pool. Records endpoints, NAT status, and active gateway.',
  },
  {
    id: 'raven-agent',
    title: 'Raven Agent',
    subtitle: 'Data Plane — DaemonSet on Every Node',
    icon: Activity,
    color: '#7c6ff7',
    desc: 'Configures routes or VPN tunnels based on node role. Gateway nodes establish encrypted tunnels; normal nodes route through local gateway.',
  },
]

const NETWORK_LAYERS = [
  {
    id: 'l3',
    title: 'Layer 3 — IP / VPN',
    icon: Shield,
    color: '#5ab8db',
    items: ['IPsec (libreswan)', 'WireGuard (UDP 4500)', 'VXLAN overlay per pool'],
  },
  {
    id: 'l7',
    title: 'Layer 7 — HTTP / Proxy',
    icon: Globe,
    color: '#e8a65c',
    items: ['Reverse channel cloud→edge', 'NodeName+Port routing', 'NAT traversal for kubectl'],
  },
]

export default function ArchitectureView() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="arch-wrap">
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, margin: '0 0 8px 0', color: '#e8eaf0' }}>
          What is Raven?
        </h2>
        <p style={{ fontSize: 13, color: '#8a94a8', margin: 0, lineHeight: 1.7 }}>
          Raven is an OpenYurt component that provides layer 3 and layer 7 network connectivity
          among pods in different physical regions, making them appear as if they are in one
          vanilla Kubernetes cluster. It uses VPN tunnels between gateway nodes and preserves
          the existing CNI for intra-pool traffic.
        </p>
      </div>

      <div className="arch-grid">
        {COMPONENTS.map((c) => {
          const Icon = c.icon
          const isHovered = hovered === c.id
          return (
            <div
              key={c.id}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: isHovered ? c.color + '40' : undefined,
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: c.color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.color,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#5a637a', marginTop: 2 }}>
                    {c.subtitle}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#8a94a8', margin: 0, lineHeight: 1.6 }}>
                {c.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* SVG Architecture Diagram */}
      <div className="card" style={{ overflow: 'auto' }}>
        <div className="card-title">
          <Layers size={16} />
          Component Interaction Diagram
        </div>
        <svg viewBox="0 0 900 420" style={{ width: '100%', minWidth: 600 }}>
          {/* Background zones */}
          <rect x="20" y="20" width="400" height="380" rx="10" fill="#0d1018" stroke="#1a2030" strokeWidth="1" />
          <text x="40" y="45" fill="#5a637a" fontSize="11" fontFamily="JetBrains Mono, monospace">CLOUD REGION</text>

          <rect x="480" y="20" width="400" height="380" rx="10" fill="#0d1018" stroke="#1a2030" strokeWidth="1" />
          <text x="500" y="45" fill="#5a637a" fontSize="11" fontFamily="JetBrains Mono, monospace">EDGE REGION</text>

          {/* Cloud — Yurt Manager */}
          <g transform="translate(80, 80)">
            <rect x="0" y="0" width="280" height="80" rx="8" fill="#111520" stroke="#234030" strokeWidth="1" />
            <text x="140" y="30" fill="#5cdb8a" fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Yurt Manager</text>
            <text x="140" y="52" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Deployment — elects gateways</text>
            <text x="140" y="68" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">watches Gateway CRD status</text>
          </g>

          {/* Cloud — Gateway Node */}
          <g transform="translate(80, 190)">
            <rect x="0" y="0" width="280" height="100" rx="8" fill="#111520" stroke="#2a2640" strokeWidth="1" />
            <text x="140" y="25" fill="#7c6ff7" fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Cloud Gateway Node</text>
            <text x="140" y="45" fill="#8a94a8" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Raven Agent (gateway role)</text>
            <text x="140" y="60" fill="#8a94a8" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">IPsec/WireGuard VPN endpoint</text>
            <text x="140" y="78" fill="#5ab8db" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">EIP or LoadBalancer expose</text>
          </g>

          {/* Cloud — Normal Nodes */}
          <g transform="translate(80, 310)">
            <rect x="0" y="0" width="130" height="60" rx="8" fill="#111520" stroke="#1a2030" strokeWidth="1" />
            <text x="65" y="25" fill="#8a94a8" fontSize="11" fontWeight="500" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Cloud Pod</text>
            <text x="65" y="43" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VXLAN via CNI</text>
          </g>
          <g transform="translate(230, 310)">
            <rect x="0" y="0" width="130" height="60" rx="8" fill="#111520" stroke="#1a2030" strokeWidth="1" />
            <text x="65" y="25" fill="#8a94a8" fontSize="11" fontWeight="500" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Cloud Pod</text>
            <text x="65" y="43" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VXLAN via CNI</text>
          </g>

          {/* Edge — Gateway Node */}
          <g transform="translate(540, 190)">
            <rect x="0" y="0" width="280" height="100" rx="8" fill="#111520" stroke="#2a2640" strokeWidth="1" />
            <text x="140" y="25" fill="#7c6ff7" fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Edge Gateway Node</text>
            <text x="140" y="45" fill="#8a94a8" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Raven Agent (gateway role)</text>
            <text x="140" y="60" fill="#8a94a8" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VPN tunnel to cloud gateway</text>
            <text x="140" y="78" fill="#5ab8db" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">underNAT: true</text>
          </g>

          {/* Edge — Normal Nodes */}
          <g transform="translate(540, 310)">
            <rect x="0" y="0" width="130" height="60" rx="8" fill="#111520" stroke="#1a2030" strokeWidth="1" />
            <text x="65" y="25" fill="#8a94a8" fontSize="11" fontWeight="500" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Edge Pod</text>
            <text x="65" y="43" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Routes → gateway</text>
          </g>
          <g transform="translate(690, 310)">
            <rect x="0" y="0" width="130" height="60" rx="8" fill="#111520" stroke="#1a2030" strokeWidth="1" />
            <text x="65" y="25" fill="#8a94a8" fontSize="11" fontWeight="500" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Edge Pod</text>
            <text x="65" y="43" fill="#5a637a" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Routes → gateway</text>
          </g>

          {/* Arrows */}
          {/* Controller → Gateway CRD */}
          <line x1="360" y1="120" x2="540" y2="120" stroke="#2a2640" strokeWidth="1.5" strokeDasharray="4 4" />
          <polygon points="535,117 542,120 535,123" fill="#2a2640" />
          <text x="450" y="112" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Gateway CRD</text>

          {/* Cloud GW ↔ Edge GW VPN tunnel */}
          <line x1="360" y1="240" x2="540" y2="240" stroke="#7c6ff7" strokeWidth="2" />
          <polygon points="535,237 542,240 535,243" fill="#7c6ff7" />
          <polygon points="365,237 358,240 365,243" fill="#7c6ff7" />
          <rect x="420" y="225" width="60" height="18" rx="4" fill="#0d1018" stroke="#2a2640" />
          <text x="450" y="238" fill="#7c6ff7" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VPN</text>

          {/* Normal nodes to gateway — cloud */}
          <line x1="145" y1="310" x2="200" y2="290" stroke="#1a2030" strokeWidth="1" />
          <line x1="295" y1="310" x2="240" y2="290" stroke="#1a2030" strokeWidth="1" />
          <text x="220" y="315" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VXLAN</text>

          {/* Normal nodes to gateway — edge */}
          <line x1="605" y1="310" x2="660" y2="290" stroke="#1a2030" strokeWidth="1" />
          <line x1="755" y1="310" x2="700" y2="290" stroke="#1a2030" strokeWidth="1" />
          <text x="680" y="315" fill="#5a637a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">VXLAN</text>
        </svg>
      </div>

      <div className="arch-grid" style={{ marginTop: 24 }}>
        {NETWORK_LAYERS.map((l) => {
          const Icon = l.icon
          return (
            <div key={l.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: l.color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: l.color,
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>
                  {l.title}
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, color: '#8a94a8', fontSize: 12, lineHeight: 1.8 }}>
                {l.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
