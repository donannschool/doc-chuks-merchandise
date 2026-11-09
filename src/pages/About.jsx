import { useSiteSettings } from '../lib/useSiteSettings.js'

export default function About() {
  const { settings } = useSiteSettings()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
        About Us &amp; West Africa Logistics
      </h1>

      <section className="mb-10">
        <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
          {settings.about_history}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="font-display font-semibold text-navy mb-2">Cross-Border Shipping</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We dispatch orders nationwide across Nigeria via trusted park services, and send
            waybills to Ghana, Cotonou (Benin Republic) and other neighboring West African
            countries. Reach out on WhatsApp to confirm shipping cost and delivery time to your
            location.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="font-display font-semibold text-navy mb-2">Opening Hours</h2>
          <p className="text-sm text-gray-600">{settings.opening_hours}</p>
          <h2 className="font-display font-semibold text-navy mt-4 mb-2">Shop Address</h2>
          <p className="text-sm text-gray-600">{settings.shop_address}</p>
        </div>
      </section>

      {settings.directions_note && (
        <section className="mt-6 bg-amber/10 border border-amber/30 rounded-lg p-6">
          <h2 className="font-display font-semibold text-earth mb-2">Directions to ASPAMDA</h2>
          <p className="text-sm text-earth/90 leading-relaxed">{settings.directions_note}</p>
        </section>
      )}

      {settings.google_maps_embed_url && (
        <section className="mt-8">
          <h2 className="font-display font-semibold text-navy mb-3">Find Us on the Map</h2>
          <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video">
            <iframe
              src={settings.google_maps_embed_url}
              title="Shop location map"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}
    </div>
  )
}
