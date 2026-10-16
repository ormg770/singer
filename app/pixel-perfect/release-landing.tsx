"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ArrowDown, Camera, Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";
import { getCountdown, PRE_SAVE_URL, RELEASE_AT } from "@/lib/pixel-perfect";
import styles from "./release.module.css";

const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => true;

export default function ReleaseLanding() {
  const [countdown, setCountdown] = useState<ReturnType<
    typeof getCountdown
  > | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [photos, setPhotos] = useState(0);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    serverReducedMotion,
  );
  const effects = effectsEnabled && !reducedMotion;
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
      const title = titleRef.current?.getBoundingClientRect();
      const cta = ctaRef.current?.getBoundingClientRect();
      if (title && cta)
        setStickyVisible(
          title.bottom <= 0 &&
            !(cta.bottom > 0 && cta.top < window.innerHeight),
        );
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
        glints[index++ % glints.length],
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
        release: "pixel-perfect",
        location,
        placement: location === "hero" ? "release-hero" : "release-sticky",
        destination: PRE_SAVE_URL,
      });
    } catch {
      /* Analytics must never prevent navigation. */
    }
  }

  const ctaLabel = countdown?.released
    ? "LISTEN NOW"
    : "PRE-SAVE PIXEL PERFECT";
  return (
    <main className={styles.page} data-effects={effects ? "on" : "off"}>
      <a className={styles.skip} href="#release">
        Skip to release
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="Diana Mae home">
          DIANA MAE<span aria-hidden="true">®</span>
        </Link>
        <span className={styles.headerNote}>
          <span aria-hidden="true" /> THE NEXT CHAPTER
        </span>
        <Link href="/" className={styles.back}>
          Official site <ArrowUpRight size={16} aria-hidden="true" />
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
            A new era. A little more electric.
            <br />
            Be the first to hear it.
          </p>
          <div className={styles.releaseDate}>
            <span className={styles.dot} aria-hidden="true" />
            <time dateTime={RELEASE_AT}>OCTOBER 26, 2026</time>
            <span className={styles.dateRule} aria-hidden="true" />
          </div>
          <div
            className={styles.countdown}
            role="timer"
            aria-live="off"
            aria-label="Release: October 26, 2026, midnight UTC minus four"
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
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
          <p className={styles.ctaNote}>
            {countdown?.released
              ? "Choose your music service."
              : "Save it now. Make it yours on release day."}
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
              </div>
              <div className={styles.photoArea}>
                <Image
                  src="/pixel-perfect-cover-v2.jpg"
                  alt="Official cover artwork for Pixel Perfect by Diana Mae"
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
                  aria-label="Take a paparazzi photo of the cover"
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
                  <span className={styles.recording} aria-hidden="true">
                    <span /> REC
                  </span>
                </button>
              </div>
              <div className={styles.frameBottom}>
                <span>NEW SINGLE</span>
                <span>DIGITAL DREAMS, REAL FEELINGS</span>
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
              <Camera size={15} aria-hidden="true" /> TAP THE COVER. TAKE YOUR
              SHOT.
            </span>
            <span role="status" aria-live="polite" aria-atomic="true">
              FOTO {String(photos).padStart(2, "0")}
            </span>
          </figcaption>
          <div className={styles.artControls}>
            <a href="#presave" className={styles.artNote}>
              Your next obsession <ArrowDown size={15} aria-hidden="true" />
            </a>
            <button
              type="button"
              className={styles.effectsToggle}
              aria-pressed={effects}
              disabled={reducedMotion}
              onClick={() => setEffectsEnabled((value) => !value)}
            >
              {effects ? "Effects on" : "Effects off"}
            </button>
          </div>
        </figure>
      </section>
      <div className={styles.ticker} aria-hidden="true">
        <span ref={tickerRef}>
          PIXEL PERFECT ✦ COMING OCTOBER 26 ✦ A NEW ERA ✦ PIXEL PERFECT ✦ COMING
          OCTOBER 26 ✦ A NEW ERA ✦
        </span>
      </div>
      <footer className={styles.footer}>
        <span>© {new Date().getUTCFullYear()} DIANA MAE</span>
        <span>
          MADE OF MUSIC & A LITTLE MAGIC <span aria-hidden="true">✦</span>
        </span>
        <Link href="/">
          DIANAMAE.COM <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </footer>
      {stickyVisible && (
        <aside className={styles.stickyBar} aria-label="Release shortcut">
          <a
            href={PRE_SAVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("sticky")}
            className={styles.cta}
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight size={21} aria-hidden="true" />
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </aside>
      )}
    </main>
  );
}
