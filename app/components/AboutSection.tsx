'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icons } from './Icons'
import AudioPlayer from './AudioPlayer'

export default function AboutSection() {
    const sectionRef = useScrollReveal<HTMLElement>(0.1)
    const photoRef = useRef<HTMLDivElement>(null)

    // Parallax: photo moves ~30% slower than scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!photoRef.current) return
            const rect = photoRef.current.getBoundingClientRect()
            const viewH = window.innerHeight
            const center = rect.top + rect.height / 2 - viewH / 2
            photoRef.current.style.transform = `translateY(${center * -0.06}px)`
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    const [settings, setSettings] = useState<Record<string, string>>({
        bio_text: 'Born under a sky full of stars in the heart of New Orleans, Diana Mae found her voice in the space between silence and thunder. Her music weaves soul, dark pop, and cinematic soundscapes into something entirely her own.',
        bio_text_2: 'After years of performing in intimate venues across the American South, Diana burst onto the global stage with her debut EP Midnight Veil in 2023, amassing over 50 million streams.',
        stat_releases: '4',
        stat_streams: '50M+',
        stat_countries: '20+',
        bio_title: 'A Voice That Commands the Dark',
        bio_image: '', // Start empty to prevent initial flash of placeholder if a custom one exists
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
                    <div data-reveal className="reveal reveal-left photo-wrapper" style={{ position: 'relative' }}>
                        <div ref={photoRef} style={{ transition: 'transform 0.1s linear' }}>
                            {/* Decorative border */}
                            <div
                                className="photo-border"
                                style={{
                                    position: 'absolute',
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
                                {settings.bio_image && (
                                    <img
                                        src={settings.bio_image}
                                        alt="Diana Mae"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: 'saturate(0.8) contrast(1.05)',
                                        }}
                                    />
                                )}
                                {/* Gradient overlay */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background:
                                            'linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 50%)',
                                    }}
                                />
                            </div>
                            <div
                                data-reveal
                                className="reveal reveal-delay-2 badge-bottom"
                                style={{
                                    position: 'absolute',
                                    background: 'rgba(255, 215, 0, 0.08)',
                                    backdropFilter: 'blur(20px)',
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 215, 0, 0.25)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    zIndex: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)',
                                        border: '1px solid rgba(255, 215, 0, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div
                                        className="font-display"
                                        style={{
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            backgroundImage: 'linear-gradient(135deg, #FFF6A9 0%, #DFB129 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {settings.bio_badge_primary_text || '2M+'}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'rgba(255, 235, 150, 0.8)', marginTop: '4px', letterSpacing: '0.02em' }}>
                                        {settings.bio_badge_secondary_text || 'Monthly Listeners'}
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div
                                className="glass-card badge-top"
                                style={{
                                    position: 'absolute',
                                    padding: '12px 18px',
                                    borderRadius: '14px',
                                    backdropFilter: 'blur(16px)',
                                    zIndex: 2,
                                    textAlign: 'center',
                                    border: '1px solid rgba(224, 64, 251, 0.25)',
                                }}
                            >
                                <div style={{ display: 'flex', color: 'var(--accent-magenta)' }}>
                                    <Icons.MusicNote style={{ width: 24, height: 24 }} />
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', letterSpacing: '0.05em' }}>
                                    {settings.bio_badge_text || 'Since 2019'}
                                </div>
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
                                marginBottom: settings.audio_message_active === 'true' && settings.audio_message_url ? '10px' : (settings.bio_text_3 ? '20px' : '40px'),
                            }}
                        >
                            {settings.bio_text_2}
                        </p>

                        {settings.audio_message_active === 'true' && settings.audio_message_url && (
                            <AudioPlayer
                                src={settings.audio_message_url}
                                title={settings.audio_message_title}
                                buttonText={settings.audio_message_btn}
                            />
                        )}

                        {settings.bio_text_3 && (
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: 'rgba(255,255,255,0.55)',
                                    lineHeight: 1.85,
                                    marginBottom: '40px',
                                }}
                            >
                                {settings.bio_text_3}
                            </p>
                        )}

                        {/* Stats row */}
                        <div
                            className="stats-grid"
                            style={{
                                display: 'grid',
                                gap: '16px',
                                marginBottom: '40px',
                            }}
                        >
                            {[
                                { value: settings.stat_releases ?? '24+', label: settings.stat_label_1 ?? 'Releases', icon: settings.stat_icon_1 },
                                { value: settings.stat_streams ?? '5M+', label: settings.stat_label_2 ?? 'Streams', icon: settings.stat_icon_2 },
                                { value: settings.stat_countries ?? '12', label: settings.stat_label_3 ?? 'Countries Toured', icon: settings.stat_icon_3 },
                            ].map((stat, i) => {
                                const IconComponent = stat.icon && stat.icon !== 'None' ? Icons[stat.icon as keyof typeof Icons] : null;
                                return (
                                    <div
                                        key={i}
                                        className="glass-card stat-box"
                                        style={{
                                            padding: '20px 16px',
                                            borderRadius: '16px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {IconComponent && (
                                            <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '8px', width: '24px', height: '24px', margin: '0 auto 8px' }}>
                                                <IconComponent />
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '2rem',
                                                fontWeight: 600,
                                                color: 'white',
                                                lineHeight: 1,
                                            }}
                                            className="text-gradient stat-value font-display"
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.5)',
                                                marginTop: '12px',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Socials */}
                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            {[
                                { name: 'Spotify', icon: <Icons.Spotify style={{ width: 16, height: 16 }} />, url: settings.social_spotify, brandColor: '#1DB954' },
                                { name: 'Instagram', icon: <Icons.Instagram style={{ width: 16, height: 16 }} />, url: settings.social_instagram, brandColor: '#E1306C' },
                                { name: 'TikTok', icon: <Icons.TikTok style={{ width: 16, height: 16 }} />, url: settings.social_tiktok, brandColor: '#25F4EE' },
                                { name: 'YouTube', icon: <Icons.YouTube style={{ width: 16, height: 16 }} />, url: settings.social_youtube, brandColor: '#FF0000' },
                            ]
                                .filter(social => !!social.url)
                                .map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`social-btn social-btn-${social.name.toLowerCase()}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '11px 20px',
                                            borderRadius: '50px',
                                            textDecoration: 'none',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <div className="social-btn-icon" style={{ display: 'flex', alignItems: 'center', transition: 'color 0.25s ease' }}>{social.icon}</div>
                                        {social.name}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .photo-border { inset: -20px; }
        .badge-bottom { left: -20px; bottom: -20px; }
        .badge-top { top: -10px; right: -20px; }
        .stats-grid { grid-template-columns: repeat(3, 1fr); }

        /* Social buttons micro-interactions */
        .social-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease,
                      border-color 0.25s ease,
                      color 0.25s ease,
                      background 0.25s ease;
          will-change: transform;
        }
        .social-btn:hover {
          transform: scale(1.07);
          color: white !important;
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(180, 120, 255, 0.45) !important;
          box-shadow: 0 0 18px rgba(180, 120, 255, 0.3),
                      0 4px 16px rgba(0, 0, 0, 0.3);
        }
        .social-btn:active {
          transform: scale(0.97);
        }
        /* Platform icon colors on hover */
        .social-btn-spotify:hover .social-btn-icon { color: #1DB954; }
        .social-btn-instagram:hover .social-btn-icon { color: #E1306C; }
        .social-btn-tiktok:hover .social-btn-icon { color: #25F4EE; }
        .social-btn-youtube:hover .social-btn-icon { color: #FF0000; }
        
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .photo-wrapper { margin: 0 16px; }
          .photo-border { inset: -10px; }
          .badge-bottom { left: -10px; bottom: -15px; padding: 12px 16px !important; }
          .badge-top { top: -10px; right: -10px; padding: 8px 12px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid > div:last-child {
             grid-column: span 2;
          }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stats-grid > div:last-child { grid-column: span 1; }
        }
      `}</style>
        </section>
    )
}
