'use client'

import { useEffect, useState } from 'react'
import { GalleryItem } from '@/lib/supabase'

const categories = ['all', 'promo', 'live', 'studio']

export default function GallerySection() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [filter, setFilter] = useState('all')
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

    useEffect(() => {
        fetch('/api/gallery')
            .then((r) => r.json())
            .then(setItems)
    }, [])

    const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter)

    return (
        <section
            id="gallery"
            style={{
                padding: '140px 0',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent, rgba(5,5,8,0.5) 100%)',
            }}
        >
            <div
                className="bg-orb"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, rgba(224, 64, 251, 0.07) 0%, transparent 70%)',
                    top: '10%',
                    left: '-15%',
                }}
            />

            <div className="section-container">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="section-label">Gallery</div>
                    <h2 className="section-title">
                        Behind the <em>Lens</em>
                    </h2>
                    <div className="divider" style={{ margin: '24px auto' }} />

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '50px',
                                    border: `1px solid ${filter === cat ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)'}`,
                                    background: filter === cat ? 'rgba(147,51,234,0.2)' : 'transparent',
                                    color: filter === cat ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Grid */}
                <div
                    style={{
                        columns: '3 280px',
                        columnGap: '16px',
                    }}
                >
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setLightbox(item)}
                            style={{
                                position: 'relative',
                                marginBottom: '16px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                breakInside: 'avoid',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement
                                if (overlay) overlay.style.opacity = '1'
                                e.currentTarget.style.transform = 'scale(1.01)'
                            }}
                            onMouseLeave={(e) => {
                                const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement
                                if (overlay) overlay.style.opacity = '0'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            <img
                                src={item.image_url}
                                alt={item.caption}
                                style={{ width: '100%', display: 'block', borderRadius: '16px' }}
                                loading="lazy"
                            />
                            <div
                                className="gallery-overlay"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(26,8,48,0.85) 0%, transparent 60%)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '20px',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: 'white',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {item.caption}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: 'rgba(255,255,255,0.5)',
                                            textTransform: 'capitalize',
                                            letterSpacing: '0.08em',
                                        }}
                                    >
                                        {item.category}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    onClick={() => setLightbox(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.94)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div
                        style={{ position: 'relative', maxWidth: '85vw', maxHeight: '85vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: 0,
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '26px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                        <img
                            src={lightbox.image_url.replace('w=800', 'w=1400')}
                            alt={lightbox.caption}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '82vh',
                                objectFit: 'contain',
                                borderRadius: '16px',
                            }}
                        />
                        <p
                            style={{
                                textAlign: 'center',
                                marginTop: '16px',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '14px',
                            }}
                        >
                            {lightbox.caption}
                        </p>
                    </div>
                </div>
            )}
        </section>
    )
}
