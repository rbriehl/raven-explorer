import { useState, useEffect } from 'react'

const REGIONS = [
  {
    id: 'cloud',
    name: 'Cloud Region',
    x: 150,
    y: 120,
    color: '#5cdb8a',
    gateway: { name: 'cloud-gw', ip: '10.0.1.10', expose: 'EIP' },
    nodes: [
      { name: 'cloud-node-1', role: 'normal', ip: '10.0.1.20' },
      { name: 'cloud-node-2', role: 'normal', ip: '10.0.1.21' },
    ],
    pods: ['svc-api', 'svc-db'],
  },
  {
    id: 'edge-hz',
    name: 'Edge Hangzhou',
    x: 500,
    y: 80,
    color: '#7c6ff7',
    gateway: { name: 'hz-gw', ip: '192.168.10.1', expose: 'NAT' },
    nodes: [
      { name: 'hz-node-1', role: 'normal', ip: '192.168.10.20' },
      { name: 'hz-node-2', role: 'normal', ip: '192.168.10.21' },
    ],
    pods: ['edge-app-1', 'edge-cache'],
  },
  {
    id: 'edge-bj',
    name: 'Edge Beijing',
    x: 500,
    y: 300,
    color: '#db5a8a',
    gateway: { name: 'bj-gw', ip: '192.168.20.1', expose: 'NAT' },
    nodes: [
      { name: 'bj-node-1', role: 'normal', ip: '192.168.20.20' },
    ],
    pods: ['edge-app-2'],
  },
]

export default function TopologyMap() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [packets, setPackets] = useState([])

  const spawnPacket = (from, to) => {
    const id = Math.random().toString(36).slice(2)
    setPackets((p) => [...p.slice(-20), { id, from, to, t: Date.now() }])
    setTimeout(() => {
      setPackets((p) => p.filter((x) => x.id !== id))
    }, 2000)
  }

  return (
    <div className="topo-wrap">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="topo-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#7c6ff7', border: '2px solid #9a8fff' }} />
            Gateway Node
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#1a1f2e', border: '2px solid #2a2640' }} />
            Normal Node
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#5ab8db' }} />
            VPN Tunnel
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#1a2030', border: '1px dashed #2a3040' }} />
            VXLAN Overlay
          </div>
        </div>

        <svg viewBox="0 0 750 420" style={{ width: '100%', minWidth: 500 }}>
          {/* VXLAN ellipses for each region */}
          {REGIONS.map((r) => (
            <ellipse
              key={r.id}
              cx={r.x + 60}
              cy={r.y + 60}
              rx={120}
              ry={90}
              fill="none"
              stroke={r.color + '20'}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* VPN tunnels between gateways */}
          {/* Cloud ↔ Edge HZ */}
          <line x1="210" y1="180" x2="560" y2="140" stroke="#5ab8db" strokeWidth="2" opacity="0.6" />
          <line x1="210" y1="180" x2="560" y2="140" stroke="#5ab8db" strokeWidth="4" strokeDasharray="6 10" opacity="0.3" style={{ animation: 'flow-dash 1s linear infinite' }} />

          {/* Cloud ↔ Edge BJ */}
          <line x1="210" y1="180" x2="560" y2="360" stroke="#5ab8db" strokeWidth="2" opacity="0.6" />
          <line x1="210" y1="180" x2="560" y2="360" stroke="#5ab8db" strokeWidth="4" strokeDasharray="6 10" opacity="0.3" style={{ animation: 'flow-dash 1.2s linear infinite' }} />

          {/* Edge HZ ↔ Edge BJ */}
          <line x1="560" y1="140" x2="560" y2="360" stroke="#5ab8db" strokeWidth="2" opacity="0.4" />
          <line x1="560" y1="140" x2="560" y2="360" stroke="#5ab8db" strokeWidth="4" strokeDasharray="6 10" opacity="0.2" style={{ animation: 'flow-dash 1.5s linear infinite' }} />

          {/* VPN labels */}
          <text x="380" y="145" fill="#5ab8db" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace" opacity="0.7">IPsec/WireGuard</text>
          <text x="320" y="290" fill="#5ab8db" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace" opacity="0.7">IPsec/WireGuard</text>

          {/* Regions */}
          {REGIONS.map((r) => {
            const isSelected = selectedRegion === r.id
            return (
              <g
                key={r.id}
                transform={`translate(${r.x}, ${r.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedRegion(isSelected ? null : r.id)}
              >
                {/* Region label */}
                <text x="60" y="-10" fill={r.color} fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                  {r.name}
                </text>

                {/* Gateway node */}
                <rect x="20" y="20" width="80" height="44" rx="6" fill="#13172a" stroke={isSelected ? r.color : '#2a2640'} strokeWidth={isSelected ? 2 : 1} />
                <text x="60" y="38" fill={r.color} fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{r.gateway.name}</text>
                <text x="60" y="54" fill="#5a637a" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{r.gateway.ip}</text>

                {/* Normal nodes */}
                {r.nodes.map((n, i) => (
                  <g key={n.name} transform={`translate(${i * 65 + 5}, 80)`}>
                    <rect x="0" y="0" width="60" height="36" rx="6" fill="#0d1018" stroke="#1a2030" strokeWidth="1" />
                    <text x="30" y="15" fill="#8a94a8" fontSize="8" fontWeight="500" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{n.name}</text>
                    <text x="30" y="28" fill="#4a5268" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{n.ip}</text>
                  </g>
                ))}

                {/* Pod icons */}
                {r.pods.map((p, i) => (
                  <g key={p} transform={`translate(${i * 55 + 10}, 130)`}>
                    <rect x="0" y="0" width="50" height="20" rx="4" fill={r.color + '10'} stroke={r.color + '30'} strokeWidth="1" />
                    <text x="25" y="13" fill={r.color + 'cc'} fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{p}</text>
                  </g>
                ))}

                {/* Routes: normal → gateway */}
                {r.nodes.map((_, i) => (
                  <line
                    key={i}
                    x1={i * 65 + 35}
                    y1="80"
                    x2="60"
                    y2="64"
                    stroke="#1a2030"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                ))}
              </g>
            )
          })}

          {/* Animated packets */}
          {packets.map((p) => {
            // Find coordinates
            const getPos = (id) => {
              const r = REGIONS.find((x) => x.id === id)
              return r ? { x: r.x + 60, y: r.y + 42 } : { x: 0, y: 0 }
            }
            const f = getPos(p.from)
            const t = getPos(p.to)
            return (
              <circle key={p.id} r="4" fill="#e8eaf0" opacity="0.9">
                <animateMotion dur="2s" repeatCount="1" path={`M${f.x},${f.y} L${t.x},${t.y}`} />
              </circle>
            )
          })}
        </svg>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <button className="flow-btn" onClick={() => spawnPacket('edge-hz', 'cloud')}>
            Simulate Edge→Cloud
          </button>
          <button className="flow-btn" onClick={() => spawnPacket('edge-bj', 'edge-hz')}>
            Simulate Edge→Edge
          </button>
          <button className="flow-btn" onClick={() => spawnPacket('cloud', 'edge-bj')}>
            Simulate Cloud→Edge
          </button>
        </div>
      </div>

      {selectedRegion && (
        <div className="card" style={{ animation: 'fade-in 0.3s ease both' }}>
          {(() => {
            const r = REGIONS.find((x) => x.id === selectedRegion)
            if (!r) return null
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
                  <h3 style={{ margin: 0, fontSize: 15, color: '#e8eaf0' }}>{r.name}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#5a637a', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>Gateway</div>
                    <div style={{ fontSize: 13, color: '#c9cdd7', fontFamily: 'JetBrains Mono, monospace' }}>{r.gateway.name}</div>
                    <div style={{ fontSize: 12, color: '#8a94a8' }}>{r.gateway.ip} — {r.gateway.expose}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#5a637a', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>Nodes</div>
                    {r.nodes.map((n) => (
                      <div key={n.name} style={{ fontSize: 12, color: '#8a94a8', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
                        {n.name} ({n.ip})
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#5a637a', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>Workloads</div>
                    {r.pods.map((p) => (
                      <div key={p} style={{ fontSize: 12, color: '#8a94a8', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
