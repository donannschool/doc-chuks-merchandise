import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const FIELDS = [
  { key: 'business_name', label: 'Business Name', type: 'text' },
  { key: 'motto', label: 'Motto', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'about_history', label: 'About / History', type: 'textarea' },
  { key: 'whatsapp_number', label: 'Primary WhatsApp Number (digits only, with country code)', type: 'text' },
  { key: 'secondary_phone', label: 'Secondary Phone Number', type: 'text' },
  { key: 'shop_address', label: 'Shop Address', type: 'text' },
  { key: 'directions_note', label: 'Directions Note', type: 'textarea' },
  { key: 'google_maps_embed_url', label: 'Google Maps Embed URL', type: 'text' },
  { key: 'opening_hours', label: 'Opening Hours', type: 'text' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
  { key: 'tiktok_url', label: 'TikTok URL', type: 'text' },
]

export default function SiteInfoTab() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
      setForm(data || {})
    }
    load()
  }, [])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    const payload = { ...form, id: 1 }
    delete payload.updated_at
    const { error } = await supabase.from('site_settings').upsert(payload)
    setSaving(false)
    setStatus(error ? `Error: ${error.message}` : 'Saved successfully.')
  }

  if (!form) {
    return <div className="text-sm text-gray-400">Loading settings...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6 space-y-5">
      <h2 className="font-display font-semibold text-navy text-base mb-1">Website Info &amp; Contacts</h2>
      <p className="text-xs text-gray-400 mb-4">
        Changes here update the public website immediately after saving.
      </p>

      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              rows={4}
              value={form[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber resize-none"
            />
          ) : (
            <input
              type="text"
              value={form[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
          )}
        </div>
      ))}

      {status && (
        <p className={`text-xs ${status.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-navy hover:bg-navy-dark text-white text-sm font-semibold px-6 py-2.5 rounded-md transition disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
