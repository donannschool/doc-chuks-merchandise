import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { CATEGORIES } from '../lib/constants.js'
import ProductForm from './ProductForm.jsx'

export default function InventoryTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [editingProduct, setEditingProduct] = useState(null)

  async function loadProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false
      if (q) {
        const haystack = [p.product_name, p.part_number, p.car_make].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [products, search, categoryFilter])

  async function toggleStock(product) {
    await supabase
      .from('products')
      .update({ in_stock: !product.in_stock })
      .eq('id', product.id)
    loadProducts()
  }

  async function deleteProduct(product) {
    if (!confirm(`Delete "${product.product_name}"? This cannot be undone.`)) return
    await supabase.from('products').delete().eq('id', product.id)
    if (editingProduct?.id === product.id) setEditingProduct(null)
    loadProducts()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductForm
          editingProduct={editingProduct}
          onSaved={() => {
            setEditingProduct(null)
            loadProducts()
          }}
          onCancelEdit={() => setEditingProduct(null)}
        />
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="flex-1 border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          {loading ? 'Loading...' : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3.5">
              <div className="w-12 h-12 rounded-md bg-gray-100 shrink-0 overflow-hidden">
                {p.image_url && (
                  <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-navy truncate">{p.product_name}</div>
                <div className="text-xs text-gray-400 truncate">
                  Part# {p.part_number} · {p.category} · {p.car_make}
                </div>
              </div>
              <button
                onClick={() => toggleStock(p)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {p.in_stock ? 'In Stock' : 'Out of Stock'}
              </button>
              <button
                onClick={() => setEditingProduct(p)}
                className="text-xs font-semibold text-navy border border-gray-300 px-2.5 py-1.5 rounded-md shrink-0"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p)}
                className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1.5 rounded-md shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No products found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
