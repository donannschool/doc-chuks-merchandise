import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import InventoryTab from './InventoryTab.jsx'
import SiteInfoTab from './SiteInfoTab.jsx'

export default function Dashboard() {
  const [tab, setTab] = useState('inventory')

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="DOC Chuks Merchandise Ltd" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-white text-sm">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" className="text-xs text-white/70 hover:text-white hidden sm:inline">
              View Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 border-t border-white/10">
          <TabButton active={tab === 'inventory'} onClick={() => setTab('inventory')}>
            Manage Inventory
          </TabButton>
          <TabButton active={tab === 'settings'} onClick={() => setTab('settings')}>
            Edit Website Info &amp; Contacts
          </TabButton>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {tab === 'inventory' ? <InventoryTab /> : <SiteInfoTab />}
      </main>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium px-4 py-3 border-b-2 transition-colors ${
        active ? 'border-amber text-white' : 'border-transparent text-white/60 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
