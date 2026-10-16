"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import ReleaseLanding from "./release-landing";
import styles from "./flash-hunt.module.css";

export default function FlashHuntExperience() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);
  const [height, setHeight] = useState(850);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "pixel-perfect-reveal") setRevealed(true);
      if (data.type === "pixel-perfect-complete") { setRevealed(true); setComplete(true); track("pixel_perfect_game_reveal"); }
      if (data.type === "pixel-perfect-height" && typeof data.height === "number" && Number.isFinite(data.height)) setHeight(Math.max(450, Math.min(1800, Math.ceil(data.height))));
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    if (complete) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [complete]);
  return <>
    <div hidden={!revealed} inert={!complete}><ReleaseLanding /></div>
    <section className={complete ? styles.reward : styles.overlay} aria-label={complete ? "Your personalized Pixel Perfect postcard" : "Pixel Perfect Flash Hunt game"}>
      <iframe ref={frame} src="/pixel-perfect/flash-hunt.html" title="Pixel Perfect — Flash Hunt and personalized postcard" allow="autoplay; web-share" className={styles.frame} style={complete ? {height} : undefined} />
    </section>
    <noscript><p>Pixel Perfect by Diana Mae. <a href="https://ffm.to/d3x4n0">Pre-save the single</a>.</p></noscript>
  </>;
}
