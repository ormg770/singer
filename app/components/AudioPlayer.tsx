'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
    src: string
    title?: string
    buttonText?: string
}

export default function AudioPlayer({ src, title = 'A Note From Diana', buttonText = 'Listen' }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Ensure we create a clean audio element
    useEffect(() => {
        const audio = new Audio(src)
        audio.preload = 'metadata'
        audioRef.current = audio

        // Listeners to keep state in sync (if audio ends, or is paused externally)
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleEnded = () => setIsPlaying(false) // No looping

        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnded)
            audio.pause()
            audioRef.current = null
        }
    }, [src])

    const togglePlay = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            // Requirement: Single instance playback. 
            // Pause all other possible HTML audio instances (including admin previews if somehow mounted together)
            document.querySelectorAll('audio').forEach((el) => {
                el.pause()
            })
            // We can also pause any instances we created via `new Audio()` since they might not be in the DOM
            // The cleanest way is emitting a custom event, but for a global single-instance, we can rely on DOM + custom window object array if needed.
            // But since this is likely the only custom instance, a custom custom event approach works best.
            window.dispatchEvent(new CustomEvent('artist-audio-play'))

            audioRef.current.play()
        }
    }

    // Single instance global sync to stop this audio if another one plays
    useEffect(() => {
        const handleGlobalPlay = () => {
            if (audioRef.current && isPlaying) {
                audioRef.current.pause()
            }
        }
        window.addEventListener('artist-audio-play', handleGlobalPlay)
        return () => window.removeEventListener('artist-audio-play', handleGlobalPlay)
    }, [isPlaying])


    if (!src) return null

    return (
        <div style={{
            marginTop: '30px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '12px',
        }}>
            {title && (
                <h4 style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="22"></line>
                    </svg>
                    {title}
                </h4>
            )}

            <button
                onClick={togglePlay}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '30px',
                    padding: '8px 20px 8px 16px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isPlaying ? '0 0 15px rgba(255,255,255,0.1)' : 'none',
                    borderColor: isPlaying ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            >
                {/* Play / Pause toggle animation SVG */}
                <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </div>
                <span>{isPlaying ? 'Pause' : buttonText}</span>
            </button>
        </div>
    )
}
