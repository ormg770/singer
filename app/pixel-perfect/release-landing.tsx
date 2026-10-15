"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowLeft, Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";
import { getCountdown, PRE_SAVE_URL } from "@/lib/pixel-perfect";
import styles from "./release.module.css";

export default function ReleaseLanding() {
  const [countdown, setCountdown] = useState<ReturnType<
    typeof getCountdown
  > | null>(null);

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  function trackClick() {
    // Tracking must never prevent the music link from opening.
    try {
      track("presave_click", {
        release: "pixel-perfect",
        placement: "release-hero",
        destination: PRE_SAVE_URL,
      });
    } catch {
      /* Analytics may be unavailable or blocked. */
    }
  }

  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#release">
        Skip to release
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="Diana Mae home">
          DIANA MAE<span>®</span>
        </Link>
        <span className={styles.headerNote}>
          <span /> THE NEXT CHAPTER
        </span>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={14} /> Official site
        </Link>
      </header>

      <section
        id="release"
        className={styles.hero}
        aria-labelledby="release-title"
      >
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Sparkles size={15} aria-hidden="true" /> NEW SINGLE / 001
          </p>
          <h1 id="release-title" className={styles.title}>
            PIXEL
            <br />
            <span>PERFECT</span>
            <sup>✦</sup>
          </h1>
          <p className={styles.artist}>DIANA MAE</p>
          <p className={styles.description}>
            A new era. A little more electric.
            <br />
            Be the first to hear it.
          </p>
          <div className={styles.releaseDate}>
            <span className={styles.dot} /> OCTOBER 26, 2026{" "}
            <span className={styles.dateRule} />
          </div>

          <div
            className={styles.countdown}
            role="timer"
            aria-label="Time until release"
          >
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <div key={unit}>
                <strong>
                  {countdown ? String(countdown[unit]).padStart(2, "0") : "––"}
                </strong>
                <span>{unit}</span>
              </div>
            ))}
          </div>
          <p className={styles.status} role="status">
            {countdown?.released
              ? "The wait is over. Pixel Perfect is here."
              : "COUNTING DOWN TO A NEW FREQUENCY"}
          </p>

          <a
            href={PRE_SAVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick}
            className={styles.cta}
          >
            <span>
              {countdown?.released ? "LISTEN NOW" : "PRE-SAVE PIXEL PERFECT"}
            </span>
            <ArrowUpRight size={23} aria-hidden="true" />
          </a>
          <p className={styles.ctaNote}>
            {countdown?.released
              ? "Choose your music service."
              : "Save it now. Make it yours on release day."}
            <span className={styles.srOnly}> Opens in a new tab.</span>
          </p>
        </div>

        <figure className={styles.artwork}>
          <div className={styles.cameraFlashes} aria-hidden="true">
            <span className={styles.cameraFlash} />
            <span className={styles.cameraFlash} />
            <span className={styles.cameraFlash} />
          </div>
          <div className={styles.orbit} aria-hidden="true" />
          <span className={styles.star} aria-hidden="true">
            ✦
          </span>
          <div className={styles.coverFrame}>
            <div className={styles.frameTop}>
              <span>DIANA_MAE / PIXEL_PERFECT</span>
              <span>01 — 26.10.26</span>
            </div>
            <Image
              src="/pixel-perfect-cover-v2.jpg"
              alt="Official cover artwork for Pixel Perfect by Diana Mae"
              width={3000}
              height={3000}
              priority
              sizes="(max-width: 760px) 88vw, 45vw"
              className={styles.cover}
            />
            <div className={styles.frameBottom}>
              <span>NEW SINGLE</span>
              <span>✦ DIGITAL DREAMS, REAL FEELINGS</span>
            </div>
          </div>
          <figcaption className={styles.sticker}>
            100%
            <br />
            <span>DIANA MAE</span>
          </figcaption>
          <span className={styles.artNote}>
            PRESS PLAY ON YOUR NEXT OBSESSION ↗
          </span>
        </figure>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <span>
          PIXEL PERFECT ✦ DIANA MAE ✦ COMING OCTOBER 26 ✦ A NEW ERA ✦ PIXEL
          PERFECT ✦ DIANA MAE ✦ COMING OCTOBER 26 ✦ A NEW ERA ✦
        </span>
      </div>
      <footer className={styles.footer}>
        <span>© {new Date().getUTCFullYear()} DIANA MAE</span>
        <span>MADE OF MUSIC & A LITTLE MAGIC ✦</span>
        <Link href="/">
          DIANAMAE.COM <ArrowUpRight size={12} />
        </Link>
      </footer>
    </main>
  );
}
