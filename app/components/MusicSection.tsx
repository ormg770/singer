'use client'

import { useEffect, useState } from 'react'
import { Release } from '@/lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icons } from './Icons'

export default function MusicSection() {
    const [releases, setReleases] = useState<Release[]>([])
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [filter, setFilter] = useState<'all' | 'album' | 'single' | 'ep'>('all')
    const [loading, setLoading] = useState(true)
    const sectionRef = useScrollReveal<HTMLElement>(0.1)

    useEffect(() => {
        fetch('/api/releases')
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setReleases(data)
            })

        fetch('/api/settings')
            .then((r) => r.json())
            .then((sData) => {
                if (sData && typeof sData === 'object' && !Array.isArray(sData)) {
                    setSettings(sData)
                }
                setLoading(false)
            })
    }, [])

    const filtered = filter === 'all' ? releases : releases.filter((r) => r.type === filter)

    const typeColors: Record<string, string> = {
        album: '#9333ea',
        single: '#e040fb',
        ep: '#f5c842',
    }

    const platformConfig: Record<string, { label: string; icon: React.ReactNode; bg: string; border: string; color: string }> = {
        apple_music: { label: 'Apple Music', icon: <Icons.Apple style={{ width: 14, height: 14 }} />, bg: 'rgba(252, 60, 74, 0.1)', border: 'rgba(252,60,74,0.2)', color: '#fc3c4a' },
        amazon: { label: 'Amazon', icon: <Icons.Amazon style={{ width: 14, height: 14 }} />, bg: 'rgba(0, 168, 225, 0.1)', border: 'rgba(0,168,225,0.2)', color: '#00A8E1' },
        youtube: { label: 'YouTube', icon: <Icons.YouTube style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 0, 0, 0.1)', border: 'rgba(255,0,0,0.2)', color: '#FF0000' },
        tidal: { label: 'Tidal', icon: <Icons.Tidal style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.2)', color: '#FFFFFF' },
        soundcloud: { label: 'Soundcloud', icon: <Icons.SoundCloud style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 85, 0, 0.1)', border: 'rgba(255,85,0,0.2)', color: '#FF5500' },
    }

    // Safely parse platform data
    function getPlatformData(str: string | null) {
        if (!str) return { platform: 'apple_music', url: '' }
        try {
            const parsed = JSON.parse(str)
            if (parsed && typeof parsed === 'object') return parsed
        } catch {
            return { platform: 'apple_music', url: str }
        }
        return { platform: 'apple_music', url: '' }
    }

    return (
        <section
            id="music"
            ref={sectionRef}
            style={{
                padding: '140px 0',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent, rgba(26,8,48,0.3) 50%, transparent)',
            }}
        >
            <div
                className="bg-orb"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
                    top: '20%',
                    left: '-20%',
                }}
            />

            <div className="section-container">
                {/* Header */}
                <div data-reveal className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="section-label">Discography</div>
                    <h2 className="section-title">
                        {settings.music_title || <>The <em>Music</em></>}
                    </h2>
                    <div className="divider" style={{ margin: '24px auto' }} />
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>
                        {settings.music_desc || 'From debut singles to full-length albums — every release is a world to get lost in.'}
                    </p>

                    {/* Filter tabs */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            marginTop: '40px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {(['all', 'album', 'single', 'ep'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                style={{
                                    padding: '9px 22px',
                                    borderRadius: '50px',
                                    border: `1px solid ${filter === type ? 'var(--accent-purple)' : 'rgba(255,255,255,0.12)'}`,
                                    background: filter === type ? 'rgba(147,51,234,0.2)' : 'transparent',
                                    color: filter === type ? 'white' : 'rgba(255,255,255,0.55)',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    letterSpacing: '0.08em',
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {type === 'all' ? 'All' : type.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
                        Loading releases...
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {filtered.map((release, index) => {
                            const pData = getPlatformData(release.apple_music_url)
                            const pConfig = platformConfig[pData.platform] || platformConfig.apple_music
                            return (
                                <div
                                    key={release.id}
                                    data-reveal
                                    className={`glass-card glass-card-hover reveal reveal-delay-${Math.min(index + 1, 6)}`}
                                    style={{
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        transition: 'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8)';
                                        const img = e.currentTarget.querySelector('.release-cover') as HTMLElement;
                                        const overlay = e.currentTarget.querySelector('.release-overlay') as HTMLElement;
                                        if (img) img.style.transform = 'scale(1.03)';
                                        if (overlay) overlay.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '';
                                        const img = e.currentTarget.querySelector('.release-cover') as HTMLElement;
                                        const overlay = e.currentTarget.querySelector('.release-overlay') as HTMLElement;
                                        if (img) img.style.transform = 'scale(1)';
                                        if (overlay) overlay.style.opacity = '0';
                                    }}
                                >
                                    {/* Cover */}
                                    <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                                        <img
                                            src={release.cover_url}
                                            alt={release.title}
                                            className="release-cover"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        />

                                        {/* Dark overlay on hover */}
                                        <div
                                            className="release-overlay"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0.4)',
                                                opacity: 0,
                                                transition: 'opacity 0.6s ease',
                                                pointerEvents: 'none',
                                            }}
                                        />

                                        {/* Type badge */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '14px',
                                                left: '14px',
                                                padding: '5px 12px',
                                                borderRadius: '50px',
                                                background: typeColors[release.type] + '33',
                                                border: `1px solid ${typeColors[release.type]}66`,
                                                color: typeColors[release.type],
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                backdropFilter: 'blur(10px)',
                                            }}
                                        >
                                            {release.badge || release.type}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '20px' }}>
                                        <h3
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.4rem',
                                                fontWeight: 500,
                                                color: 'white',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            {release.title}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: release.tagline ? '8px' : '16px' }}>
                                            {new Date(release.release_date).getFullYear()}
                                        </p>

                                        {release.tagline && (
                                            <p style={{
                                                fontSize: '13.5px',
                                                color: 'rgba(255,255,255,0.45)',
                                                fontStyle: 'italic',
                                                lineHeight: 1.5,
                                                marginBottom: '18px',
                                                borderLeft: '2px solid rgba(147, 51, 234, 0.4)',
                                                paddingLeft: '12px'
                                            }}>
                                                {release.tagline}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <a
                                                href={release.spotify_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 0',
                                                    borderRadius: '10px',
                                                    background: 'rgba(29, 185, 84, 0.15)',
                                                    border: '1px solid rgba(29,185,84,0.25)',
                                                    color: '#1db954',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s ease',
                                                    letterSpacing: '0.05em',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Icons.Spotify style={{ width: 14, height: 14 }} /> Spotify
                                            </a>
                                            <a
                                                href={pData.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 0',
                                                    borderRadius: '10px',
                                                    background: pConfig.bg,
                                                    border: `1px solid ${pConfig.border}`,
                                                    color: pConfig.color,
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s ease',
                                                    letterSpacing: '0.05em',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                {pConfig.icon} {pConfig.label}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
