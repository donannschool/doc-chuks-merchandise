export const CATEGORIES = ['Oil Seals', 'Gasket Rubbers', 'Valve Seals', 'O-Rings & Kits']

export const CAR_MAKES = [
  'Toyota',
  'Honda',
  'Mercedes-Benz',
  'Lexus',
  'Hyundai/Kia',
  'Universal / Industrial',
]

export const SALE_TYPES = ['Wholesale & Retail', 'Wholesale Only', 'Retail Only']

// Build a wa.me link with a pre-filled message
export function buildWhatsAppLink(number, message) {
  const digitsOnly = (number || '').replace(/[^0-9]/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${digitsOnly}?text=${encoded}`
}

export function productWhatsAppMessage(product) {
  return `Hello DOC Chuks Merchandise Ltd, I saw ${product.product_name} (Part No: ${product.part_number}, Size: ${product.dimensions || 'N/A'}) on your website. Please confirm wholesale/retail price and fitment.`
}
