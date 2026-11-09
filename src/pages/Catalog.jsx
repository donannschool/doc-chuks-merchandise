import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { CATEGORIES, CAR_MAKES } from '../lib/constants.js'
import FilterPills from '../components/FilterPills.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Catalog() {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(location.state?.search || '')
  const [category, setCategory] = useState('All')
  const [carMake, setCarMake] = useState('All')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (carMake !== 'All' && p.car_make !== carMake) return false
      if (q) {
        const haystack = [p.product_name, p.part_number, p.dimensions, p.car_make]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [products, search, category, carMake])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">Product Catalog</h1>
      <p className="text-gray-500 text-sm mb-6">
        Browse our full range of oil seals, gaskets, valve seals and O-rings.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by product, part number, size, or car make..."
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-amber"
      />

      <FilterPills label="Category" options={CATEGORIES} active={category} onChange={setCategory} />
      <FilterPills label="Car Make" options={CAR_MAKES} active={carMake} onChange={setCarMake} />

      <div className="text-xs text-gray-400 mt-4 mb-4">
        {loading ? 'Loading...' : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No products match your search. Try a different term or filter.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
