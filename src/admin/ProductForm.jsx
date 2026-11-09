import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { CATEGORIES, CAR_MAKES, SALE_TYPES } from '../lib/constants.js'

const EMPTY = {
  product_name: '',
  part_number: '',
  dimensions: '',
  material_brand: '',
  category: CATEGORIES[0],
  car_make: CAR_MAKES[0],
  compatible_models: '',
  sale_type: SALE_TYPES[0],
  description: '',
  image_url: '',
  in_stock: true,
}

export default function ProductForm({ editingProduct, onSaved, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingProduct) {
      setForm({ ...EMPTY, ...editingProduct })
      setImagePreview(editingProduct.image_url || '')
      setImageFile(null)
    } else {
      setForm(EMPTY)
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingProduct])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let imageUrl = form.image_url

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        imageUrl = publicUrlData.publicUrl
      }

      const payload = { ...form, image_url: imageUrl }
      delete payload.id
      delete payload.created_at
      delete payload.updated_at

      if (editingProduct?.id) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('products').insert(payload)
        if (insertError) throw insertError
      }

      setForm(EMPTY)
      setImageFile(null)
      setImagePreview('')
      onSaved?.()
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
      <h2 className="font-display font-semibold text-navy text-sm">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      <Field label="Product Name" required>
        <input
          type="text"
          required
          value={form.product_name}
          onChange={(e) => update('product_name', e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Part Number" required>
          <input
            type="text"
            required
            value={form.part_number}
            onChange={(e) => update('part_number', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Dimensions / Size">
          <input
            type="text"
            placeholder="35x50x8mm"
            value={form.dimensions}
            onChange={(e) => update('dimensions', e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Material / Brand">
        <input
          type="text"
          placeholder="Viton, NBR, NOK, Corteco..."
          value={form.material_brand}
          onChange={(e) => update('material_brand', e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" required>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Car Make" required>
          <select
            value={form.car_make}
            onChange={(e) => update('car_make', e.target.value)}
            className="input"
          >
            {CAR_MAKES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Compatible Models">
        <input
          type="text"
          placeholder="Camry 2010-2015, Corolla 2012+"
          value={form.compatible_models}
          onChange={(e) => update('compatible_models', e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Sale Type">
        <select
          value={form.sale_type}
          onChange={(e) => update('sale_type', e.target.value)}
          className="input"
        >
          {SALE_TYPES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="input resize-none"
        />
      </Field>

      <Field label="Product Image">
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs" />
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded-md mt-2 border border-gray-200" />
        )}
      </Field>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          checked={form.in_stock}
          onChange={(e) => update('in_stock', e.target.checked)}
        />
        In Stock
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-navy hover:bg-navy-dark text-white text-sm font-semibold py-2.5 rounded-md transition disabled:opacity-60"
        >
          {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 text-sm font-medium text-gray-500 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #D97706;
        }
      `}</style>
    </form>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
