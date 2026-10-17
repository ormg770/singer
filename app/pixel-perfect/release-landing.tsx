"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ArrowDown, Camera, Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";
import { getCountdown, PRE_SAVE_URL, RELEASE_AT } from "@/lib/pixel-perfect";
import type { ReactNode } from "react";
import { copy, type Language } from "@/lib/pixel-perfect-language";
import styles from "./release.module.css";

const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => true;

function BorderLight() {
  return (
    <svg className={styles.borderLight} aria-hidden="true" focusable="false">
      <rect width="100%" height="100%" rx="3" pathLength="100" />
      <rect width="100%" height="100%" rx="3" pathLength="100" />
      <rect width="100%" height="100%" rx="3" pathLength="100" />
    </svg>
  );
}

export default function ReleaseLanding({
  lang,
  onLanguage,
  revealed,
  complete,
  reward,
  onReplay,
  onEffects,
  effectsEnabled,
  onEffectsChange,
}: {
  lang: Language;
  onLanguage: (lang: Language) => void;
  revealed: boolean;
  complete: boolean;
  reward: ReactNode;
  onReplay: () => void;
  onEffects: (enabled: boolean) => void;
  effectsEnabled: boolean;
  onEffectsChange: (enabled: boolean) => void;
}) {
  const t = copy[lang];
  const [countdown, setCountdown] = useState<ReturnType<
    typeof getCountdown
  > | null>(null);
  const [stickyVisible, setStickyVisible] = useState(true);
  const [photos, setPhotos] = useState(0);

  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    serverReducedMotion,
  );
  const effects = effectsEnabled && !reducedMotion;
  useEffect(() => onEffects(effects), [effects, onEffects]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLSpanElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);
  const triggerFlash = useRef<() => boolean>(() => false);
  const lastPhoto = useRef(-Infinity);

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    // Hide the sticky CTA as soon as any part of the main CTA is visible.
    const update = () => {
      const cta = ctaRef.current?.getBoundingClientRect();
      // Present from first paint, then stop before the main CTA and footer.
      if (cta) setStickyVisible(cta.top >= window.innerHeight);
    };
    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    const observer = new IntersectionObserver(update, { threshold: [0, 1] });
    if (titleRef.current) observer.observe(titleRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !effects) {
      triggerFlash.current = () => false;
      return;
    }
    const glints = Array.from(
      scene.querySelectorAll<HTMLElement>("[data-camera-flash]"),
    );
    const focus = scene.querySelector<HTMLElement>("[data-focus]");
    let lastFlash = -Infinity;
    let index = 0;
    let ready = false;
    let visible = false;
    let disposed = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let introTimer: ReturnType<typeof setTimeout> | undefined;
    const animations = new Set<Animation>();
    const animate = (
      element: Element,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const flash = () => {
      const now = performance.now();
      // One shared gate for intro, automatic glints and user taps: <= 1 flash / 1.2s.
      if (!ready || !visible || document.hidden || now - lastFlash < 1200)
        return false;
      lastFlash = now;
      scene.dataset.flashing = "true";
      animate(
        glints[
          (index =
            (index + 1 + Math.floor(Math.random() * (glints.length - 1))) %
            glints.length)
        ],
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(.65)" },
          {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1.05)",
            offset: 0.18,
          },
          {
            opacity: 0.25,
            transform: "translate(-50%, -50%) scale(1.1)",
            offset: 0.55,
          },
          { opacity: 0, transform: "translate(-50%, -50%) scale(1.2)" },
        ],
        { duration: 850, easing: "ease-out" },
      );
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        delete scene.dataset.flashing;
      }, 900);
      return true;
    };
    triggerFlash.current = flash;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );
    observer.observe(scene);
    // The image stays visible throughout; no opacity or blur applied to the LCP image.
    const image = scene.querySelector("img");
    const start = async () => {
      try {
        await image?.decode();
      } catch {
        /* Show the scene even if decoding fails. */
      }
      if (disposed) return;
      ready = true;
      introTimer = setTimeout(() => {
        if (flash() && focus)
          animate(
            focus,
            [
              { transform: "scale(1.08)", opacity: 0.3 },
              { transform: "scale(1)", opacity: 1 },
            ],
            { duration: 700, easing: "ease-out" },
          );
      }, 250);
    };
    void start();
    const interval = setInterval(flash, 4500);
    return () => {
      disposed = true;
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(introTimer);
      clearTimeout(settleTimer);
      animations.forEach((animation) => animation.cancel());
      triggerFlash.current = () => false;
      delete scene.dataset.flashing;
    };
  }, [effects]);

  useEffect(() => {
    if (!effects) return;
    const ticker = tickerRef.current;
    const shine = shineRef.current;
    let frame = 0;
    let lastY = window.scrollY;
    let offset = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      // Pause secondary effects during the main flash; scroll does not start any timers.
      if (sceneRef.current?.dataset.flashing) return;
      offset = Math.max(-300, Math.min(0, offset - delta * 0.28));
      if (ticker) ticker.style.transform = `translate3d(${offset}px,0,0)`;
      if (shine)
        shine.style.backgroundPosition = `${Math.max(0, 100 - y * 0.08)}% 0`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      if (ticker) ticker.style.transform = "";
      if (shine) shine.style.backgroundPosition = "";
    };
  }, [effects]);

  function takePhoto() {
    const now = performance.now();
    if (now - lastPhoto.current < 1200) return;
    if (effects) triggerFlash.current();
    lastPhoto.current = now;
    setPhotos((value) => value + 1);
  }

  function trackClick(location: "hero" | "sticky") {
    try {
      track("presave_click", {
        lang,
        location,
      });
    } catch {
      /* Analytics must never prevent navigation. */
    }
  }

  const ctaLabel = countdown?.released ? t.listen : t.presave;
  return (
    <main
      className={styles.page}
      data-effects={effects ? "on" : "off"}
      data-revealed={revealed}
      lang={lang}
    >
      <a className={styles.skip} href="#release">
        {t.skipRelease}
      </a>
      <header className={styles.header} inert={!complete}>
        <Link href="/" className={styles.wordmark} aria-label={t.home}>
          DIANA MAE<span aria-hidden="true">®</span>
        </Link>
        <span className={styles.headerNote}>
          <span aria-hidden="true" /> {t.chapter}
        </span>
        <Link href="/" className={styles.back}>
          {t.official} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <div className={styles.language} role="group" aria-label={t.langLabel}>
          {(["es", "en"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={lang === value}
              onClick={() => onLanguage(value)}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
        <button className={styles.playAgain} type="button" onClick={onReplay}>
          {t.again}
        </button>
      </header>
      <section
        id="release"
        className={styles.hero}
        inert={!complete}
        aria-labelledby="release-title"
      >
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Sparkles size={15} aria-hidden="true" /> {t.single}
          </p>
          <h1 ref={titleRef} id="release-title" className={styles.title}>
            PIXEL
            <br />
            <span>PERFECT</span>
            <sup aria-hidden="true">✦</sup>
            <span className={styles.titleShine} aria-hidden="true">
              <span ref={shineRef}>
                PIXEL
                <br />
                <small>PERFECT</small>
              </span>
            </span>
          </h1>
          <p className={styles.description}>
            {t.description}
            <br />
            {t.first}
          </p>
          <div className={styles.releaseDate}>
            <span className={styles.dot} aria-hidden="true" />
            <time dateTime={RELEASE_AT}>{t.date}</time>
            <span className={styles.dateRule} aria-hidden="true" />
          </div>
          <div
            className={styles.countdown}
            role="timer"
            aria-live="off"
            aria-label={t.timerLabel}
          >
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <div key={unit}>
                <strong>
                  {countdown ? String(countdown[unit]).padStart(2, "0") : "––"}
                </strong>
                <span>{t[unit]}</span>
              </div>
            ))}
          </div>
          <p className={styles.status} role="status">
            {countdown?.released ? t.released : t.counting}
          </p>
          <div className={styles.ctaGlow}>
            <BorderLight />
            <a
              id="presave"
              ref={ctaRef}
              href={PRE_SAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("hero")}
              className={styles.cta}
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight size={23} aria-hidden="true" />
              <span className={styles.srOnly}>{t.newTab}</span>
            </a>
          </div>
          <p className={styles.ctaNote}>
            {countdown?.released ? t.listenNote : t.note}
          </p>
        </div>
        <figure className={styles.artwork}>
          <div ref={sceneRef} className={styles.cameraScene}>
            <div className={styles.cameraFlashes} aria-hidden="true">
              <span data-camera-flash className={styles.cameraFlash} />
              <span data-camera-flash className={styles.cameraFlash} />
              <span data-camera-flash className={styles.cameraFlash} />
            </div>
            <div className={styles.orbit} aria-hidden="true" />
            <span className={styles.star} aria-hidden="true">
              ✦
            </span>
            <div className={styles.coverFrame}>
              <div className={styles.frameTop}>
                <span>PIXEL_PERFECT / 001</span>
                <span>26.10.26</span>
                <span className={styles.recording} aria-hidden="true">
                  <span /> REC
                </span>
              </div>
              <div className={styles.photoArea}>
                <Image
                  src="/pixel-perfect-cover-v2.jpg"
                  alt={t.coverAlt}
                  width={3000}
                  height={3000}
                  priority
                  sizes="(max-width: 760px) 82vw, (max-width: 1320px) 40vw, 500px"
                  className={styles.cover}
                />
                <button
                  type="button"
                  onClick={takePhoto}
                  className={styles.shutter}
                  aria-label={t.coverShot}
                  aria-describedby="camera-help"
                >
                  <span
                    data-focus
                    className={styles.focusCorners}
                    aria-hidden="true"
                  >
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </button>
              </div>
              <div className={styles.frameBottom}>
                <span>{t.digital}</span>
              </div>
            </div>
            <span className={styles.sticker} aria-hidden="true">
              POP
              <br />
              <span>IN FOCUS</span>
            </span>
          </div>
          <figcaption className={styles.cameraCaption}>
            <span id="camera-help">
              <Camera size={15} aria-hidden="true" /> {t.tap}
            </span>
            <span role="status" aria-live="polite" aria-atomic="true">
              {t.photo} {String(photos).padStart(2, "0")}
            </span>
          </figcaption>
          <div className={styles.artControls}>
            <a href="#presave" className={styles.artNote}>
              {t.obsession} <ArrowDown size={15} aria-hidden="true" />
            </a>
            <button
              type="button"
              className={styles.effectsToggle}
              aria-pressed={effects}
              disabled={reducedMotion}
              onClick={() => onEffectsChange(!effectsEnabled)}
            >
              {effects ? t.effectsOn : t.effectsOff}
            </button>
          </div>
        </figure>
      </section>
      <div className={styles.ticker} aria-hidden="true">
        <span ref={tickerRef}>{t.ticker.repeat(2)}</span>
      </div>
      <div className={styles.keepsakeSlot}>{reward}</div>
      <footer className={styles.footer} inert={!complete}>
        <span>© {new Date().getUTCFullYear()} DIANA MAE</span>
        <span>
          {t.footer} <span aria-hidden="true">✦</span>
        </span>
        <Link href="/">
          DIANAMAE.COM <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </footer>
      {complete && stickyVisible && (
        <aside className={styles.stickyBar} aria-label={t.shortcut}>
          <div className={styles.ctaGlow}>
            <BorderLight />
            <a
              href={PRE_SAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("sticky")}
              className={styles.cta}
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight size={21} aria-hidden="true" />
              <span className={styles.srOnly}>{t.newTab}</span>
            </a>
          </div>
        </aside>
      )}
    </main>
  );
}
