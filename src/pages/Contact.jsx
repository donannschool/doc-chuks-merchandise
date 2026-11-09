import { useSiteSettings } from '../lib/useSiteSettings.js'
import { buildWhatsAppLink } from '../lib/constants.js'

export default function Contact() {
  const { settings } = useSiteSettings()
  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    `Hello ${settings.business_name}, I would like to make an enquiry.`
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
        Contact &amp; Location
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <InfoCard label="WhatsApp" value={settings.whatsapp_number}>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-wa text-white text-sm font-semibold px-4 py-2 rounded-md mt-3"
          >
            Chat on WhatsApp
          </a>
        </InfoCard>

        <InfoCard label="Secondary Phone" value={settings.secondary_phone} />
        <InfoCard label="Shop Address" value={settings.shop_address} />
        <InfoCard label="Opening Hours" value={settings.opening_hours} />
      </div>

      {settings.directions_note && (
        <div className="bg-amber/10 border border-amber/30 rounded-lg p-6 mb-8">
          <h2 className="font-display font-semibold text-earth mb-2">Directions</h2>
          <p className="text-sm text-earth/90">{settings.directions_note}</p>
        </div>
      )}

      {settings.google_maps_embed_url && (
        <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video">
          <iframe
            src={settings.google_maps_embed_url}
            title="Shop location map"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value, children }) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm text-navy font-medium">{value}</div>
      {children}
    </div>
  )
}
