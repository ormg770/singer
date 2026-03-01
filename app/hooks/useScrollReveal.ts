'use client'

import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, adds 'reveal-visible' to it
 * and any child elements matching '[data-reveal]'.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Reveal the section wrapper itself
                        entry.target.classList.add('reveal-visible')
                        // Reveal all tagged children
                        const children = entry.target.querySelectorAll('[data-reveal]')
                        children.forEach((child) => child.classList.add('reveal-visible'))
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold }
        )

        observer.observe(el)

        return () => observer.disconnect()
    }, [threshold])

    return ref
}
