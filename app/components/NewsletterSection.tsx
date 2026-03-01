'use client'

import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const sectionRef = useScrollReveal<HTMLElement>(0.15)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
            })
            if (res.ok) {
                setStatus('success')
                setMessage("You're on the list! Welcome to Diana's inner circle. 🎵")
                setEmail('')
                setName('')
            } else {
                const data = await res.json()
                setStatus('error')
                setMessage(data.error || 'Something went wrong. Please try again.')
            }
        } catch {
            setStatus('error')
            setMessage('Connection error. Please try again.')
        }
    }

    return (
        <section
            id="newsletter"
            ref={sectionRef}
            style={{
                padding: '120px 0',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(26,8,48,0.8) 0%, rgba(5,5,8,1) 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Decorative circles */}
            <div
                style={{
                    position: 'absolute',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    border: '1px solid rgba(147,51,234,0.1)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: 750,
                    height: 750,
                    borderRadius: '50%',
                    border: '1px solid rgba(147,51,234,0.05)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }}
            />

            <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                <div
                    data-reveal
                    className="reveal"
                    style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
                >
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: 600,
                            margin: '0 auto',
                            padding: '60px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            border: '1px solid rgba(147,51,234,0.2)',
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #9333ea, #e040fb)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                fontSize: '28px',
                                boxShadow: '0 0 30px rgba(147,51,234,0.4)',
                            }}
                        >
                            ✉️
                        </div>

                        <div className="section-label" style={{ justifyContent: 'center' }}>
                            Inner Circle
                        </div>
                        <h2
                            className="section-title"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '16px' }}
                        >
                            Stay <em>Connected</em>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: '36px' }}>
                            Be the first to hear about new music, exclusive content, presale tickets, and
                            behind-the-scenes moments. No spam — only magic.
                        </p>

                        {status === 'success' ? (
                            <div
                                style={{
                                    padding: '20px',
                                    borderRadius: '16px',
                                    background: 'rgba(29,185,84,0.1)',
                                    border: '1px solid rgba(29,185,84,0.25)',
                                    color: '#1db954',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                }}
                            >
                                {message}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <input
                                    type="text"
                                    placeholder="Your first name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                />
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                {status === 'error' && (
                                    <p style={{ color: '#f43f5e', fontSize: '14px' }}>{message}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="btn-primary"
                                    style={{
                                        justifyContent: 'center',
                                        opacity: status === 'loading' ? 0.7 : 1,
                                        cursor: status === 'loading' ? 'wait' : 'pointer',
                                    }}
                                >
                                    {status === 'loading' ? 'Subscribing...' : 'Join the Inner Circle'}
                                </button>
                            </form>
                        )}

                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
                            Unsubscribe anytime. Your privacy is respected.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
