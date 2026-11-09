import { useState } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useSiteSettings } from '../lib/useSiteSettings.js'
import { buildWhatsAppLink } from '../lib/constants.js'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/request-seal', label: 'Request a Seal' },
  { to: '/about', label: 'About & Logistics' },
  { to: '/contact', label: 'Contact / Location' },
]

function navClass({ isActive }) {
  return `text-sm font-medium transition-colors ${
    isActive ? 'text-amber' : 'text-white/85 hover:text-amber'
  }`
}

export default function SiteLayout() {
  const { settings } = useSiteSettings()
  const [menuOpen, setMenuOpen] = useState(false)
  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    `Hello ${settings.business_name}, I would like to make an enquiry.`
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Trust banner */}
      <div className="bg-earth text-white text-xs sm:text-sm text-center py-1.5 px-3">
        Wholesale &amp; Retail Available&nbsp;|&nbsp;Nationwide Nigeria Delivery &amp; West Africa Waybill (Ghana, Cotonou &amp; Neighboring Countries)
      </div>

      {/* Header */}
      <header className="bg-navy sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src="logo-mark.png" alt="DOC Chuks Merchandise Ltd" className="w-10 h-10 object-contain" />
              <div className="leading-tight">
                <div className="font-display font-semibold text-white text-sm sm:text-base">
                  DOC Chuks Merchandise
                </div>
                <div className="text-[10px] sm:text-xs text-white/60 italic hidden sm:block">
                  {settings.motto}
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:block">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-wa hover:brightness-95 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-navy-dark border-t border-white/10 px-4 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block text-white/90 text-sm font-medium py-1.5"
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-wa text-white text-sm font-semibold px-4 py-2.5 rounded-md mt-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy-dark text-white/80 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src="logo-mark.png" alt={settings.business_name} className="w-14 h-14 object-contain mb-3" />
            <div className="font-display font-semibold text-white mb-2">{settings.business_name}</div>
            <p className="text-sm italic text-amber-light mb-3">{settings.motto}</p>
            <p className="text-sm leading-relaxed">{settings.tagline}</p>
          </div>

          <div>
            <div className="font-display font-semibold text-white mb-3 text-sm">Quick Links</div>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-amber transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-display font-semibold text-white mb-3 text-sm">Contact</div>
            <ul className="space-y-2 text-sm">
              <li>{settings.shop_address}</li>
              <li>WhatsApp: {settings.whatsapp_number}</li>
              {settings.secondary_phone && <li>Phone: {settings.secondary_phone}</li>}
              <li>{settings.opening_hours}</li>
            </ul>
          </div>

          <div>
            <div className="font-display font-semibold text-white mb-3 text-sm">Follow Us</div>
            <div className="flex gap-3">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber transition-colors">
                  IG
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber transition-colors">
                  FB
                </a>
              )}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber transition-colors">
                  TT
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp button, mobile */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="lg:hidden fixed bottom-5 right-5 z-40 bg-wa text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.44 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.14 0 4.15.83 5.67 2.35a7.97 7.97 0 0 1 2.35 5.67c0 4.42-3.6 8.02-8.02 8.02a8 8 0 0 1-4.07-1.11l-.29-.17-3.14.82.84-3.06-.19-.3a7.95 7.95 0 0 1-1.22-4.24c0-4.42 3.6-8.02 8.02-8.02zm-3.88 4.3c-.17 0-.44.06-.67.31s-.88.86-.88 2.09.9 2.42 1.02 2.59c.13.17 1.76 2.68 4.27 3.76.6.26 1.06.42 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.3-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.8.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.44.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.76-1.84-.2-.48-.4-.42-.56-.42z" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
