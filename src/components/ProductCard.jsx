import { buildWhatsAppLink, productWhatsAppMessage } from '../lib/constants.js'
import { useSiteSettings } from '../lib/useSiteSettings.js'

export default function ProductCard({ product }) {
  const { settings } = useSiteSettings()
  const waLink = buildWhatsAppLink(settings.whatsapp_number, productWhatsAppMessage(product))

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <SealPlaceholderIcon className="w-16 h-16" />
          </div>
        )}
        <span
          className={`absolute top-2 left-2 text-[11px] font-semibold px-2 py-1 rounded ${
            product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-navy text-sm leading-snug line-clamp-2 mb-1.5">
          {product.product_name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[11px] font-medium bg-navy/5 text-navy px-2 py-0.5 rounded">
            Part# {product.part_number}
          </span>
          {product.dimensions && (
            <span className="text-[11px] font-medium bg-amber/10 text-earth px-2 py-0.5 rounded">
              {product.dimensions}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-1">{product.material_brand}</p>
        {product.compatible_models && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">Fits: {product.compatible_models}</p>
        )}

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-1.5 bg-wa hover:brightness-95 text-white text-xs font-semibold py-2.5 rounded-md transition"
        >
          Confirm Size &amp; Price on WhatsApp
        </a>
      </div>
    </div>
  )
}

function SealPlaceholderIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}
