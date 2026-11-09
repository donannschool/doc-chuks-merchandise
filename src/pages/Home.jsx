import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useSiteSettings } from '../lib/useSiteSettings.js'
import { buildWhatsAppLink } from '../lib/constants.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const { settings } = useSiteSettings()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    `Hello ${settings.business_name}, I would like to make an enquiry.`
  )

  useEffect(() => {
    async function loadFeatured() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8)
      if (data) setFeatured(data)
    }
    loadFeatured()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }
    const timeout = setTimeout(async () => {
      const q = search.trim()
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(
          `product_name.ilike.%${q}%,part_number.ilike.%${q}%,dimensions.ilike.%${q}%,car_make.ilike.%${q}%`
        )
        .limit(8)
      setResults(data || [])
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="max-w-2xl">
            <p className="text-amber-light text-sm font-semibold mb-3">{settings.motto}</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
              {settings.business_name}
            </h1>
            <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed">
              {settings.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-wa hover:brightness-95 text-white font-semibold px-6 py-3 rounded-md transition"
              >
                Chat on WhatsApp
              </a>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center bg-amber hover:brightness-95 text-navy font-semibold px-6 py-3 rounded-md transition"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Live search */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, part number, size, or car make..."
                className="w-full bg-white rounded-md px-4 py-3 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber"
              />
              {results.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-30">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate('/catalog', { state: { search } })}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                    >
                      <div className="text-sm font-medium text-navy">{p.product_name}</div>
                      <div className="text-xs text-gray-500">
                        Part# {p.part_number} {p.dimensions ? `· ${p.dimensions}` : ''} · {p.car_make}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => navigate('/catalog', { state: { search } })}
                    className="w-full text-center text-xs font-semibold text-amber py-2.5 hover:bg-gray-50"
                  >
                    See all results in Catalog →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-navy">
              Featured Products
            </h2>
            <Link to="/catalog" className="text-sm font-semibold text-amber hover:text-earth">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <ValueProp
            title="Genuine Parts"
            text="Authentic Oil Seals, Gasket Rubbers, Valve Seals & O-Rings from trusted brands like NOK, Corteco & Viton."
          />
          <ValueProp
            title="Wholesale & Retail"
            text="Whether you need a single seal or bulk stock for your shop, we supply both at fair prices."
          />
          <ValueProp
            title="Nationwide & West Africa Delivery"
            text="We ship across Nigeria and dispatch waybills to Ghana, Cotonou and neighboring countries."
          />
        </div>
      </section>
    </div>
  )
}

function ValueProp({ title, text }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <h3 className="font-display font-semibold text-navy mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
    </div>
  )
}
