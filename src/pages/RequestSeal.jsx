import { useState } from 'react'
import { useSiteSettings } from '../lib/useSiteSettings.js'
import { buildWhatsAppLink } from '../lib/constants.js'

export default function RequestSeal() {
  const { settings } = useSiteSettings()
  const [name, setName] = useState('')
  const [type, setType] = useState('Retail')
  const [details, setDetails] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const message = `Hello ${settings.business_name}, my name is ${name || '[Name]'}. I am looking to buy ${type}.\n\nCar Model / Seal Dimensions Needed:\n${details || '[Not specified]'}\n\nPlease confirm availability and price.`
    const link = buildWhatsAppLink(settings.whatsapp_number, message)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
        Request a Specific Seal or Size
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Can't find what you need in the catalog? Tell us what you're looking for and we'll
        confirm availability over WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 rounded-lg p-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emeka Obi"
            className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Wholesale or Retail</label>
          <div className="flex gap-3">
            {['Retail', 'Wholesale'].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setType(opt)}
                className={`flex-1 text-sm font-medium py-2.5 rounded-md border transition-colors ${
                  type === opt
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Car Model or Seal Dimensions Needed
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            placeholder="e.g. Toyota Camry 2015 front crankshaft oil seal, or 35x50x8mm"
            className="w-full border border-gray-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-wa hover:brightness-95 text-white font-semibold py-3 rounded-md transition"
        >
          Send Request on WhatsApp
        </button>
      </form>
    </div>
  )
}
