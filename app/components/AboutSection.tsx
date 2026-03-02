'use client'

import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icons } from './Icons'

export default function AboutSection() {
    const sectionRef = useScrollReveal<HTMLElement>(0.1)
    const [settings, setSettings] = useState<Record<string, string>>({
        bio_text: 'Born under a sky full of stars in the heart of New Orleans, Diana Mae found her voice in the space between silence and thunder. Her music weaves soul, dark pop, and cinematic soundscapes into something entirely her own.',
        bio_text_2: 'After years of performing in intimate venues across the American South, Diana burst onto the global stage with her debut EP Midnight Veil in 2023, amassing over 50 million streams.',
        stat_releases: '4',
        stat_streams: '50M+',
        stat_countries: '20+',
        bio_title: 'A Voice That Commands the Dark',
        bio_image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700&q=85',
    })

    useEffect(() => {
        fetch('/api/settings').then((r) => r.json()).then((data) => {
            if (data && typeof data === 'object') setSettings((prev) => ({ ...prev, ...data }))
        }).catch(() => { })
    }, [])
    return (
        <section
            id="about"
            ref={sectionRef}
            style={{
                padding: '140px 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background orb */}
            <div
                className="bg-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(243, 63, 94, 0.08) 0%, transparent 70%)',
                    top: '0',
                    right: '-10%',
                }}
            />

            <div className="section-container">
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '80px',
                        alignItems: 'center',
                    }}
                    className="about-grid"
                >
                    {/* Photo side */}
                    <div data-reveal className="reveal reveal-left" style={{ position: 'relative' }}>
                        {/* Decorative border */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: '-20px',
                                border: '1px solid rgba(147, 51, 234, 0.2)',
                                borderRadius: '24px',
                                zIndex: 0,
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                aspectRatio: '3/4',
                                zIndex: 1,
                            }}
                        >
                            <img
                                src={settings.bio_image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700&q=85'}
                                alt="Diana Mae"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'saturate(0.8) contrast(1.05)',
                                }}
                            />
                            {/* Gradient overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 50%)',
                                }}
                            />
                            {/* Stat badge */}
                            <div
                                className="glass-card"
                                style={{
                                    position: 'absolute',
                                    bottom: '24px',
                                    left: '24px',
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(16px)',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '28px',
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 600,
                                        color: 'white',
                                        lineHeight: 1,
                                    }}
                                >
                                    2M+
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                    Monthly Listeners
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div
                            className="glass-card"
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-20px',
                                padding: '12px 18px',
                                borderRadius: '14px',
                                backdropFilter: 'blur(16px)',
                                zIndex: 2,
                                textAlign: 'center',
                                border: '1px solid rgba(224, 64, 251, 0.25)',
                            }}
                        >
                            <div style={{ fontSize: '24px' }}>🎵</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', letterSpacing: '0.05em' }}>
                                Since 2019
                            </div>
                        </div>
                    </div>

                    {/* Text side */}
                    <div data-reveal className="reveal reveal-delay-2">
                        <div className="section-label">About Diana</div>
                        <h2
                            className="section-title"
                            style={{ whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{
                                __html: settings.bio_title
                                    ? settings.bio_title
                                    : `A Voice That<br /><em>Commands the Dark</em>`
                            }}
                        />
                        <div className="divider" />

                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.65)',
                                lineHeight: 1.85,
                                marginBottom: '20px',
                            }}
                        >
                            {settings.bio_text}
                        </p>

                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.55)',
                                lineHeight: 1.85,
                                marginBottom: '40px',
                            }}
                        >
                            {settings.bio_text_2}
                        </p>

                        {/* Stats row */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '16px',
                                marginBottom: '40px',
                            }}
                        >
                            {[
                                { value: settings.stat_releases || '4', label: 'Releases' },
                                { value: settings.stat_streams || '50M+', label: 'Streams' },
                                { value: settings.stat_countries || '20+', label: 'Countries Toured' },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="glass-card"
                                    style={{
                                        padding: '20px 16px',
                                        borderRadius: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '2rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            lineHeight: 1,
                                        }}
                                        className="text-gradient"
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: 'rgba(255,255,255,0.5)',
                                            marginTop: '6px',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Socials */}
                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            {[
                                { name: 'Spotify', icon: <Icons.Spotify style={{ width: 16, height: 16 }} />, url: settings.social_spotify },
                                { name: 'Instagram', icon: <Icons.Instagram style={{ width: 16, height: 16 }} />, url: settings.social_instagram },
                                { name: 'TikTok', icon: <Icons.TikTok style={{ width: 16, height: 16 }} />, url: settings.social_tiktok },
                                { name: 'YouTube', icon: <Icons.YouTube style={{ width: 16, height: 16 }} />, url: settings.social_youtube },
                            ]
                                .filter(social => !!social.url)
                                .map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            borderRadius: '50px',
                                            textDecoration: 'none',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(224,64,251,0.4)'
                                            e.currentTarget.style.color = 'white'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>{social.icon}</div>
                                        {social.name}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
        </section>
    )
}
