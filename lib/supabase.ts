import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Release = {
    id: string
    title: string
    type: 'album' | 'single' | 'ep'
    cover_url: string
    release_date: string
    spotify_url: string
    apple_music_url: string
}

export type Show = {
    id: string
    venue: string
    city: string
    country: string
    show_date: string
    ticket_url: string
    is_sold_out: boolean
}

export type GalleryItem = {
    id: string
    image_url: string
    caption: string
    category: string
    sort_order: number
}

export type Video = {
    id: string
    title: string
    youtube_id: string
    thumbnail_url: string
    type: string
}

export type SiteSettings = {
    key: string
    value: string
}

export type Merch = {
    id: string
    name: string
    price: string
    image_url: string
    badge: string
    store_url: string
    sort_order: number
}
