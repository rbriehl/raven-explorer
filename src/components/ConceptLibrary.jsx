import { useState } from 'react'
import { Server, Activity, FileCode, Shield, Globe, Network, ChevronRight, Copy, Check } from 'lucide-react'
import { RAVEN_CONCEPTS, VERSION_HISTORY } from '../data/concepts'

const ICON_MAP = {
  Server,
  Activity,
  FileCode,
  Shield,
  Globe,
  Network,
}

const BADGE_MAP = {
  'Control Plane': 'badge-control',
  'Data Plane': 'badge-data',
  'Networking': 'badge-network',
  'API / CRD': 'badge-crd',
}

export default function ConceptLibrary() {
  const [selected, setSelected] = useState(RAVEN_CONCEPTS[0])
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (selected.yaml) {
      navigator.clipboard.writeText(selected.yaml)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="concepts-wrap">
      <div className="concept-grid">
        {RAVEN_CONCEPTS.map((c) => {
          const Icon = ICON_MAP[c.icon] || Server
          const isActive = selected.id === c.id
          return (
            <div
              key={c.id}
              className={`concept-card ${isActive ? 'active' : ''}`}
              onClick={() => setSelected(c)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isActive ? '#7c6ff720' : '#0d1018',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#7c6ff7' : '#5a637a',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: '#5a637a', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    <span className={`badge ${BADGE_MAP[c.type] || 'badge-data'}`}>{c.type}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#8a94a8', margin: 0, lineHeight: 1.5 }}>
                {c.description.slice(0, 100)}...
              </p>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="concept-detail">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h3>{selected.title}</h3>
            <span className={`badge ${BADGE_MAP[selected.type] || 'badge-data'}`}>{selected.type}</span>
          </div>
          <p>{selected.description}</p>

          {selected.details && (
            <>
              <div style={{ fontSize: 11, color: '#5a637a', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>
                Key Details
              </div>
              <ul>
                {selected.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </>
          )}

          {selected.yaml && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#5a637a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Example YAML
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'none',
                    border: '1px solid #1a2030',
                    borderRadius: 4,
                    padding: '3px 8px',
                    color: copied ? '#5cdb8a' : '#5a637a',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre>{selected.yaml}</pre>
            </>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">
          <ChevronRight size={16} />
          Version History
        </div>
        <table className="version-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {VERSION_HISTORY.map((v) => (
              <tr key={v.version}>
                <td>{v.version}</td>
                <td style={{ color: '#5a637a', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{v.date}</td>
                <td>{v.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
