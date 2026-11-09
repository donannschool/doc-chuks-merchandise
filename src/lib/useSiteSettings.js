import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const FALLBACK = {
  business_name: 'DOC Chuks Merchandise Ltd',
  motto: 'With God all things are possible',
  tagline: 'Wholesale & Retail Importers of Genuine Oil Seals, Gasket Rubbers, Valve Seals & O-Rings',
  about_history: '',
  whatsapp_number: '2348033460040',
  secondary_phone: '+234 913 748 8033',
  shop_address: 'Zone B, Block 1, Shop 53, ASPAMDA Main Gate, Trade Fair International, Ojo, Lagos',
  directions_note: '',
  google_maps_embed_url: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  opening_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()
      if (active) {
        if (data && !error) setSettings(data)
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return { settings, loading }
}
