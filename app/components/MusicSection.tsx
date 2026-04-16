'use client'

import { useEffect, useState } from 'react'
import { Release } from '@/lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icons } from './Icons'

type PlatformLink = { platform: string; url: string }

const platformConfig: Record<string, { label: string; icon: React.ReactNode; bg: string; border: string; color: string }> = {
    spotify: { label: 'Spotify', icon: <Icons.Spotify style={{ width: 14, height: 14 }} />, bg: 'rgba(29, 185, 84, 0.15)', border: 'rgba(29,185,84,0.25)', color: '#1db954' },
    apple_music: { label: 'Apple Music', icon: <Icons.Apple style={{ width: 14, height: 14 }} />, bg: 'rgba(252, 60, 74, 0.1)', border: 'rgba(252,60,74,0.2)', color: '#fc3c4a' },
    amazon: { label: 'Amazon Music', icon: <Icons.Amazon style={{ width: 14, height: 14 }} />, bg: 'rgba(0, 168, 225, 0.1)', border: 'rgba(0,168,225,0.2)', color: '#00A8E1' },
    youtube: { label: 'YouTube Music', icon: <Icons.YouTube style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 0, 0, 0.1)', border: 'rgba(255,0,0,0.2)', color: '#FF0000' },
    tidal: { label: 'Tidal', icon: <Icons.Tidal style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.2)', color: '#FFFFFF' },
    soundcloud: { label: 'SoundCloud', icon: <Icons.SoundCloud style={{ width: 14, height: 14 }} />, bg: 'rgba(255, 85, 0, 0.1)', border: 'rgba(255,85,0,0.2)', color: '#FF5500' },
    deezer: { label: 'Deezer', icon: <Icons.Deezer style={{ width: 14, height: 14 }} />, bg: 'rgba(162, 56, 255, 0.1)', border: 'rgba(162,56,255,0.2)', color: '#A238FF' },
}

// Preferred display order
const platformOrder = ['spotify', 'apple_music', 'amazon', 'youtube', 'tidal', 'soundcloud', 'deezer']

function parsePlatformLinks(release: Release): PlatformLink[] {
    // Try new platform_links field first
    if (release.platform_links) {
        try {
            const links = typeof release.platform_links === 'string'
                ? JSON.parse(release.platform_links)
                : release.platform_links
            if (Array.isArray(links) && links.length > 0) {
                return links.filter((l: PlatformLink) => l.url && l.url.trim() !== '')
            }
        } catch { /* fall through to legacy */ }
    }

    // Fallback: legacy fields
    const result: PlatformLink[] = []
    if (release.spotify_url) {
        result.push({ platform: 'spotify', url: release.spotify_url })
    }
    if (release.apple_music_url) {
        try {
            const parsed = JSON.parse(release.apple_music_url)
            if (parsed?.url) result.push({ platform: parsed.platform || 'apple_music', url: parsed.url })
        } catch {
            result.push({ platform: 'apple_music', url: release.apple_music_url })
        }
    }
    return result
}

export default function MusicSection() {
    const [releases, setReleases] = useState<Release[]>([])
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [filter, setFilter] = useState<'all' | 'album' | 'single' | 'ep'>('all')
    const [loading, setLoading] = useState(true)
    const sectionRef = useScrollReveal<HTMLElement>(0.1)

    // After data loads, if the section was already revealed, reveal the new cards
    useEffect(() => {
        if (!loading && sectionRef.current) {
            // Use requestAnimationFrame to ensure DOM has updated with the new cards
            requestAnimationFrame(() => {
                const section = sectionRef.current
                if (!section) return
                if (section.classList.contains('reveal-visible')) {
                    // Cards rendered after observer fired — reveal them now
                    const children = section.querySelectorAll('[data-reveal]')
                    children.forEach((child) => child.classList.add('reveal-visible'))
                }
            })
            // Failsafe: if observer never fired (e.g. section already in viewport on load),
            // reveal everything after a short delay
            const timer = setTimeout(() => {
                const section = sectionRef.current
                if (!section) return
                if (!section.classList.contains('reveal-visible')) {
                    section.classList.add('reveal-visible')
                    const children = section.querySelectorAll('[data-reveal]')
                    children.forEach((child) => child.classList.add('reveal-visible'))
                }
            }, 1200)
            return () => clearTimeout(timer)
        }
    }, [loading, releases, filter])

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
                            const links = parsePlatformLinks(release)
                            // Sort by preferred order
                            const sortedLinks = [...links].sort((a, b) => {
                                const ai = platformOrder.indexOf(a.platform)
                                const bi = platformOrder.indexOf(b.platform)
                                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
                            })

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

                                        {/* Platform Links */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: sortedLinks.length > 2 ? 'repeat(2, 1fr)' : `repeat(${sortedLinks.length}, 1fr)`,
                                            gap: '8px',
                                        }}>
                                            {sortedLinks.map((link) => {
                                                const config = platformConfig[link.platform]
                                                if (!config) return null
                                                return (
                                                    <a
                                                        key={link.platform}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="platform-link-btn"
                                                        style={{
                                                            padding: '8px 6px',
                                                            borderRadius: '10px',
                                                            background: config.bg,
                                                            border: `1px solid ${config.border}`,
                                                            color: config.color,
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            textAlign: 'center',
                                                            textDecoration: 'none',
                                                            transition: 'all 0.3s ease',
                                                            letterSpacing: '0.03em',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '5px',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = config.color
                                                            e.currentTarget.style.color = '#000'
                                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                                            e.currentTarget.style.boxShadow = `0 4px 16px ${config.border}`
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = config.bg
                                                            e.currentTarget.style.color = config.color
                                                            e.currentTarget.style.transform = 'translateY(0)'
                                                            e.currentTarget.style.boxShadow = 'none'
                                                        }}
                                                    >
                                                        {config.icon} {config.label}
                                                    </a>
                                                )
                                            })}
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
