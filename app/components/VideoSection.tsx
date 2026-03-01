'use client'

import { useEffect, useState } from 'react'
import { Video } from '@/lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function VideoSection() {
    const [videos, setVideos] = useState<Video[]>([])
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    const sectionRef = useScrollReveal<HTMLElement>(0.1)

    useEffect(() => {
        fetch('/api/videos')
            .then((r) => r.json())
            .then(setVideos)
    }, [])

    return (
        <section
            id="videos"
            ref={sectionRef}
            style={{
                padding: '140px 0',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent, rgba(5,5,8,0.8) 100%)',
            }}
        >
            <div className="section-container">
                <div data-reveal className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="section-label">Visuals</div>
                    <h2 className="section-title">
                        Watch & <em>Experience</em>
                    </h2>
                    <div className="divider" style={{ margin: '24px auto' }} />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px',
                    }}
                >
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="glass-card"
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.4s ease',
                            }}
                            onClick={() => setActiveVideo(video.youtube_id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)'
                                e.currentTarget.style.boxShadow = '0 24px 48px rgba(147,51,234,0.25)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            {/* Thumbnail */}
                            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                    alt={video.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.35)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.95)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 0 0 8px rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a0830">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Type badge */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        padding: '4px 10px',
                                        borderRadius: '50px',
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(8px)',
                                        color: 'rgba(255,255,255,0.75)',
                                        fontSize: '11px',
                                        letterSpacing: '0.08em',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {video.type.replace('_', ' ')}
                                </div>
                            </div>

                            <div style={{ padding: '18px' }}>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.15rem',
                                        fontWeight: 500,
                                        color: 'white',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox / modal player */}
            {activeVideo && (
                <div
                    onClick={() => setActiveVideo(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.92)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div
                        style={{ position: 'relative', width: '90vw', maxWidth: 900 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveVideo(null)}
                            style={{
                                position: 'absolute',
                                top: '-44px',
                                right: 0,
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '28px',
                                cursor: 'pointer',
                                lineHeight: 1,
                            }}
                        >
                            ✕
                        </button>
                        <div style={{ aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
