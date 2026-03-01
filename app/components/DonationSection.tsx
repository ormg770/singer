'use client'

import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useState } from 'react'

const perks = [
    {
        emoji: '🎵',
        title: 'Fuel the Music',
        desc: 'Help Diana create more original songs and recordings',
    },
    {
        emoji: '💌',
        title: 'Exclusive Updates',
        desc: 'Get special behind-the-scenes content from supporters',
    },
    {
        emoji: '✨',
        title: "Artist's Gratitude",
        desc: 'Your name celebrated in Diana\'s supporter community',
    },
]

export default function DonationSection() {
    const sectionRef = useScrollReveal<HTMLElement>(0.15)
    const [settings, setSettings] = useState<Record<string, string>>({
        support_title: 'Fuel the <em>Music</em>',
        support_desc: 'Creating music takes love, time, and resources. If Diana\'s voice has moved you, consider buying her a coffee — every sip fuels a new song.',
        support_card_title: 'Buy Diana a <em>Coffee</em>',
        support_card_text: 'Each coffee goes directly toward studio time, new recordings, and keeping the music flowing. Thank you for making this possible. 🙏',
        support_btn_text: 'Support on Ko-fi',
        support_icon: '☕',
        support_url: 'https://ko-fi.com/dianamaeofficial',
    })

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data: { key: string; value: string }[]) => {
                const map: Record<string, string> = {}
                data.forEach((item) => (map[item.key] = item.value))
                setSettings((prev) => ({ ...prev, ...map }))
            })
            .catch((err) => console.error('Error fetching settings:', err))
    }, [])

    return (
        <section
            id="support"
            ref={sectionRef}
            style={{
                padding: '120px 0',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #050508 0%, #0d0618 50%, #050508 100%)',
            }}
        >
            {/* Background orbs */}
            <div
                className="bg-orb"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, rgba(255,94,91,0.12) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="bg-orb"
                style={{
                    width: 350,
                    height: 350,
                    background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)',
                    top: '20%',
                    right: '10%',
                }}
            />

            <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div
                    data-reveal
                    className="reveal"
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <div className="section-label" style={{ textAlign: 'center' }}>Support the Artist</div>
                    <h2
                        className="section-title"
                        style={{ marginBottom: '16px' }}
                        dangerouslySetInnerHTML={{ __html: settings.support_title }}
                    />
                    <div className="divider" style={{ margin: '24px auto' }} />
                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '17px',
                            maxWidth: '520px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                        }}
                    >
                        {settings.support_desc}
                    </p>
                </div>

                {/* Main Ko-fi card */}
                <div
                    data-reveal
                    className="reveal reveal-delay-2"
                    style={{ maxWidth: 640, margin: '0 auto 56px' }}
                >
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,94,91,0.2)',
                            borderRadius: '32px',
                            padding: '56px 48px',
                            textAlign: 'center',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Subtle inner glow */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'radial-gradient(ellipse at 50% 0%, rgba(255,94,91,0.08) 0%, transparent 60%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Coffee icon */}
                        <div
                            style={{
                                width: 88,
                                height: 88,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FF5E5B, #ff7043)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 28px',
                                fontSize: '40px',
                                boxShadow: '0 0 40px rgba(255,94,91,0.45)',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {settings.support_icon}
                        </div>

                        <h3
                            className="font-display"
                            style={{
                                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                                fontWeight: 400,
                                color: 'var(--text-primary)',
                                marginBottom: '12px',
                                position: 'relative',
                                zIndex: 1,
                                lineHeight: 1.2,
                            }}
                            dangerouslySetInnerHTML={{ __html: settings.support_card_title }}
                        />

                        <p
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: '15px',
                                marginBottom: '36px',
                                lineHeight: 1.7,
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {settings.support_card_text}
                        </p>

                        <a
                            href={settings.support_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-kofi"
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            <span style={{ fontSize: '20px' }}>{settings.support_icon}</span>
                            {settings.support_btn_text}
                        </a>

                        <p
                            style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                marginTop: '18px',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            Secure payments via Ko-fi · No account required
                        </p>
                    </div>
                </div>

                {/* Perk cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        maxWidth: 780,
                        margin: '0 auto',
                    }}
                >
                    {perks.map((perk, i) => (
                        <div
                            key={perk.title}
                            data-reveal
                            className={`reveal reveal-delay-${i + 3}`}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '20px',
                                padding: '28px 24px',
                                textAlign: 'center',
                                backdropFilter: 'blur(12px)',
                                transition: 'border-color 0.3s ease, transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,94,91,0.3)'
                                e.currentTarget.style.transform = 'translateY(-4px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    marginBottom: '12px',
                                    filter: 'drop-shadow(0 0 8px rgba(255,94,91,0.3))',
                                }}
                            >
                                {perk.emoji}
                            </div>
                            <h4
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {perk.title}
                            </h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {perk.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
