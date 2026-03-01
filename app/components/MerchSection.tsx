'use client'

import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Merch } from '@/lib/supabase'

export default function MerchSection() {
    const sectionRef = useScrollReveal<HTMLElement>(0.1)
    const [merch, setMerch] = useState<Merch[]>([])

    useEffect(() => {
        fetch('/api/merch').then((r) => r.json()).then((data) => {
            if (Array.isArray(data)) setMerch(data)
        })
    }, [])
    return (
        <section
            id="merch"
            ref={sectionRef}
            style={{
                padding: '140px 0',
                position: 'relative',
            }}
        >
            <div
                className="bg-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(245, 200, 66, 0.08) 0%, transparent 70%)',
                    top: '20%',
                    right: '-10%',
                }}
            />

            <div className="section-container">
                <div data-reveal className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="section-label">Official Store</div>
                    <h2 className="section-title">
                        Wear the <em>Music</em>
                    </h2>
                    <div className="divider" style={{ margin: '24px auto' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 450, margin: '0 auto' }}>
                        Limited edition drops, tour merch, and collector's items. Get yours before they're gone.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px',
                        marginBottom: '48px',
                    }}
                >
                    {merch.map((item) => (
                        <div
                            key={item.id}
                            className="glass-card glass-card-hover"
                            style={{ borderRadius: '20px', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                        filter: 'saturate(0.85)',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                {/* Badge */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '14px',
                                        right: '14px',
                                        padding: '5px 12px',
                                        borderRadius: '50px',
                                        background: 'rgba(245, 200, 66, 0.2)',
                                        border: '1px solid rgba(245,200,66,0.4)',
                                        color: '#f5c842',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    {item.badge}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.2rem',
                                            fontWeight: 500,
                                            color: 'white',
                                        }}
                                    >
                                        {item.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: '1.1rem',
                                            color: 'var(--accent-gold)',
                                            fontWeight: 600,
                                            marginTop: '4px',
                                        }}
                                    >
                                        {item.price}
                                    </p>
                                </div>
                                {item.store_url ? (
                                    <a
                                        href={item.store_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '12px',
                                            background: 'rgba(147,51,234,0.2)',
                                            border: '1px solid rgba(147,51,234,0.35)',
                                            color: 'var(--accent-purple)',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                        }}
                                    >
                                        Shop
                                    </a>
                                ) : (
                                    <button
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '12px',
                                            background: 'rgba(147,51,234,0.2)',
                                            border: '1px solid rgba(147,51,234,0.35)',
                                            color: 'var(--accent-purple)',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Shop
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <a
                        href="https://store.example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                    >
                        View Full Store →
                    </a>
                </div>
            </div>
        </section>
    )
}
