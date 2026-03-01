'use client'

import { useEffect, useState } from 'react'
import { Show } from '@/lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ShowsSection() {
    const [shows, setShows] = useState<Show[]>([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useScrollReveal<HTMLElement>(0.1)

    useEffect(() => {
        fetch('/api/shows')
            .then((r) => r.json())
            .then((data) => {
                setShows(data)
                setLoading(false)
            })
    }, [])

    const upcoming = shows.filter(
        (s) => new Date(s.show_date) >= new Date()
    )
    const past = shows.filter(
        (s) => new Date(s.show_date) < new Date()
    )

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return {
            day: d.toLocaleDateString('en-US', { day: '2-digit' }),
            month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
            year: d.getFullYear(),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        }
    }

    return (
        <section
            id="shows"
            ref={sectionRef}
            style={{
                padding: '140px 0',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent, rgba(26,8,48,0.25) 50%, transparent)',
            }}
        >
            <div
                className="bg-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(245, 200, 66, 0.07) 0%, transparent 70%)',
                    bottom: '10%',
                    right: '-10%',
                }}
            />

            <div className="section-container">
                <div data-reveal className="reveal" style={{ textAlign: 'center', marginBottom: '70px' }}>
                    <div className="section-label">Live Events</div>
                    <h2 className="section-title">
                        Tour <em>Dates</em>
                    </h2>
                    <div className="divider" style={{ margin: '24px auto' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                        Experience Diana Mae live. Every show is a one-of-a-kind journey.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                        Loading shows...
                    </div>
                ) : (
                    <>
                        {/* Upcoming shows */}
                        {upcoming.length > 0 && (
                            <div style={{ marginBottom: '60px' }}>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.4rem',
                                        fontWeight: 400,
                                        color: 'var(--text-secondary)',
                                        marginBottom: '24px',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Upcoming Shows
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {upcoming.map((show, idx) => {
                                        const date = formatDate(show.show_date)
                                        return (
                                            <div
                                                key={show.id}
                                                className="glass-card"
                                                style={{
                                                    borderRadius: '18px',
                                                    padding: '24px 28px',
                                                    display: 'grid',
                                                    gridTemplateColumns: '80px 1fr auto',
                                                    alignItems: 'center',
                                                    gap: '24px',
                                                    transition: 'all 0.3s ease',
                                                    border: idx === 0 ? '1px solid rgba(224,64,251,0.25)' : '1px solid rgba(255,255,255,0.06)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(6px)'
                                                    e.currentTarget.style.borderColor = 'rgba(147,51,234,0.4)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(0)'
                                                    e.currentTarget.style.borderColor = idx === 0 ? 'rgba(224,64,251,0.25)' : 'rgba(255,255,255,0.06)'
                                                }}
                                            >
                                                {/* Date */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <div
                                                        style={{
                                                            fontFamily: 'var(--font-display)',
                                                            fontSize: '2.2rem',
                                                            fontWeight: 600,
                                                            color: idx === 0 ? 'var(--accent-magenta)' : 'white',
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {date.day}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            letterSpacing: '0.15em',
                                                            color: idx === 0 ? 'var(--accent-magenta)' : 'var(--text-muted)',
                                                            marginTop: '2px',
                                                        }}
                                                    >
                                                        {date.month} {date.year}
                                                    </div>
                                                </div>

                                                {/* Show info */}
                                                <div>
                                                    <h4
                                                        style={{
                                                            fontFamily: 'var(--font-display)',
                                                            fontSize: '1.35rem',
                                                            fontWeight: 500,
                                                            color: 'white',
                                                            marginBottom: '4px',
                                                        }}
                                                    >
                                                        {show.venue}
                                                    </h4>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                                        {show.city}, {show.country} · {date.time}
                                                    </p>
                                                </div>

                                                {/* CTA */}
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    {show.is_sold_out ? (
                                                        <span
                                                            style={{
                                                                padding: '8px 18px',
                                                                borderRadius: '50px',
                                                                background: 'rgba(255,255,255,0.06)',
                                                                color: 'var(--text-muted)',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                letterSpacing: '0.08em',
                                                            }}
                                                        >
                                                            SOLD OUT
                                                        </span>
                                                    ) : (
                                                        <a
                                                            href={show.ticket_url || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn-primary"
                                                            style={{ padding: '10px 22px', fontSize: '12px' }}
                                                        >
                                                            Get Tickets
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Past shows */}
                        {past.length > 0 && (
                            <div>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.4rem',
                                        fontWeight: 400,
                                        color: 'var(--text-muted)',
                                        marginBottom: '20px',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Past Shows
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {past.map((show) => {
                                        const date = formatDate(show.show_date)
                                        return (
                                            <div
                                                key={show.id}
                                                style={{
                                                    padding: '18px 24px',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'grid',
                                                    gridTemplateColumns: '80px 1fr auto',
                                                    gap: '20px',
                                                    alignItems: 'center',
                                                    opacity: 0.45,
                                                }}
                                            >
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {date.day} {date.month}
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                                                        {show.venue}
                                                    </span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                                        {' '}— {show.city}, {show.country}
                                                    </span>
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'var(--text-muted)',
                                                        letterSpacing: '0.08em',
                                                    }}
                                                >
                                                    PAST
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {shows.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                                No shows scheduled yet. Check back soon!
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
