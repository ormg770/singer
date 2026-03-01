'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [settings, setSettings] = useState<Record<string, string>>({
        hero_tagline: 'Singer · Songwriter · Performer',
        hero_cta_primary_label: 'Listen Now',
        hero_cta_primary_href: '#music',
        hero_cta_secondary_label: 'View Tour Dates',
        hero_cta_secondary_href: '#shows',
    })

    useEffect(() => {
        fetch('/api/settings').then((r) => r.json()).then((data) => {
            if (data && typeof data === 'object') setSettings((prev) => ({ ...prev, ...data }))
        }).catch(() => { })
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: {
            x: number; y: number; vx: number; vy: number;
            size: number; opacity: number; color: string;
        }[] = []

        const colors = ['#9333ea', '#e040fb', '#f5c842', '#f43f5e', '#a855f7']

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.6 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
            })
        }

        let animId: number

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 130) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(147, 51, 234, ${0.08 * (1 - dist / 130)})`
                        ctx.lineWidth = 0.5
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }

            // Draw particles
            particles.forEach((p) => {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = p.opacity
                ctx.fill()
                ctx.globalAlpha = 1
            })

            animId = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <section
            id="home"
            style={{
                position: 'relative',
                height: '100vh',
                minHeight: '700px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: settings.hero_bg_image
                    ? `linear-gradient(to bottom, rgba(10,8,18,0.7) 0%, rgba(5,5,8,1) 100%), url(${settings.hero_bg_image}) center/cover no-repeat`
                    : 'radial-gradient(ellipse at 50% 60%, #1a0830 0%, #0a0812 40%, #050508 100%)',
            }}
        >
            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            />

            {/* Gradient orbs */}
            <div
                className="bg-orb"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
                    top: '10%',
                    left: '-15%',
                    zIndex: 0,
                }}
            />
            <div
                className="bg-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(224, 64, 251, 0.2) 0%, transparent 70%)',
                    bottom: '5%',
                    right: '-10%',
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                className="section-container"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: 900,
                }}
            >
                {/* Eyebrow */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '32px',
                        opacity: 0,
                        animation: 'fadeInUp 1s ease 0.2s forwards',
                    }}
                >
                    <div style={{ width: 40, height: 1, background: 'var(--accent-magenta)' }} />
                    <span className="section-label" style={{ marginBottom: 0, fontSize: '10px' }}>
                        Official Artist
                    </span>
                    <div style={{ width: 40, height: 1, background: 'var(--accent-magenta)' }} />
                </div>

                {/* Main name */}
                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(5rem, 14vw, 13rem)',
                        fontWeight: 300,
                        lineHeight: 0.9,
                        letterSpacing: '-0.03em',
                        opacity: 0,
                        animation: 'fadeInUp 1.2s ease 0.4s forwards',
                    }}
                >
                    <span
                        className="text-gradient glow-text"
                        style={{ display: 'block', fontStyle: 'italic' }}
                    >
                        Diana
                    </span>
                    <span
                        style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 200,
                            letterSpacing: '0.15em',
                            fontSize: 'clamp(2rem, 6vw, 5.5rem)',
                            marginTop: '8px',
                        }}
                    >
                        Mae
                    </span>
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(14px, 2vw, 17px)',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginTop: '28px',
                        marginBottom: '48px',
                        opacity: 0,
                        animation: 'fadeInUp 1s ease 0.7s forwards',
                    }}
                >
                    {settings.hero_tagline || 'Singer · Songwriter · Performer'}
                </p>

                {/* CTAs */}
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        opacity: 0,
                        animation: 'fadeInUp 1s ease 0.9s forwards',
                    }}
                >
                    <a href={settings.hero_cta_primary_href || '#music'} className="btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Listen Now
                    </a>
                    <a href="#shows" className="btn-outline">
                        View Tour Dates
                    </a>
                </div>

                {/* Scroll indicator */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-180px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: 0,
                        animation: 'fadeInUp 1s ease 1.2s forwards',
                    }}
                >
                    <span
                        style={{
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                        }}
                    >
                        Scroll
                    </span>
                    <div
                        style={{
                            width: '1px',
                            height: '60px',
                            background: 'linear-gradient(to bottom, rgba(224,64,251,0.6), transparent)',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
