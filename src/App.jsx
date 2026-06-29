import { useState } from 'react'
import {
  LayoutDashboard,
  Network,
  Route,
  BookOpen,
  GitBranch,
  Menu,
  X,
  Feather,
} from 'lucide-react'
import ArchitectureView from './components/ArchitectureView'
import TopologyMap from './components/TopologyMap'
import TrafficSimulator from './components/TrafficSimulator'
import ConceptLibrary from './components/ConceptLibrary'
import './App.css'

const TABS = [
  { key: 'architecture', label: 'Architecture', icon: LayoutDashboard },
  { key: 'topology', label: 'Topology', icon: Network },
  { key: 'traffic', label: 'Traffic Flows', icon: Route },
  { key: 'concepts', label: 'Concept Library', icon: BookOpen },
]

function Sidebar({ active, onChange, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <div className="mobile-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Feather className="brand-icon" size={22} />
          <div>
            <div className="brand-title">Raven Explorer</div>
            <div className="brand-subtitle">OpenYurt Edge Networking</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { onChange(t.key); onClose() }}
              >
                <Icon size={18} />
                <span>{t.label}</span>
                {isActive && <div className="nav-indicator" />}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-meta">
            <GitBranch size={12} />
            <span>openyurtio/raven</span>
          </div>
          <div className="footer-meta">
            <span>v0.4.3</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderTab = () => {
    switch (activeTab) {
      case 'architecture': return <ArchitectureView />
      case 'topology': return <TopologyMap />
      case 'traffic': return <TrafficSimulator />
      case 'concepts': return <ConceptLibrary />
      default: return <ArchitectureView />
    }
  }

  return (
    <div className="app">
      <Sidebar
        active={activeTab}
        onChange={setActiveTab}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="topbar-title">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h1>
          <a
            className="topbar-link"
            href="https://github.com/openyurtio/raven"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </header>
        <div className="content">
          {renderTab()}
        </div>
      </main>
    </div>
  )
}
