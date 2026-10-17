"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { copy, type Language } from "@/lib/pixel-perfect-language";
import ReleaseLanding from "./release-landing";
import styles from "./flash-hunt.module.css";

const allowedEvents = new Set([
  "flash_hunt_start",
  "flash_hunt_capture",
  "flash_hunt_complete",
  "flash_hunt_skip",
  "landing_revealed",
  "share_click",
  "keepsake_save",
  "presave_click",
]);
export default function FlashHuntExperience({
  initialLang,
}: {
  initialLang: Language;
}) {
  const frame = useRef<HTMLIFrameElement>(null),
    langRef = useRef(initialLang),
    completed = useRef(false);
  const [effectsChoice, setEffectsChoice] = useState(true);
  const notifyEffects = useCallback((enabled: boolean) => {
    frame.current?.contentWindow?.postMessage(
      { type: "pixel-perfect-effects", enabled },
      location.origin,
    );
  }, []);
  const notifyFlash = useCallback((active: boolean) => {
    frame.current?.contentWindow?.postMessage(
      { type: "pixel-perfect-cover-flash", active },
      location.origin,
    );
  }, []);
  const [lang, setLang] = useState<Language>(initialLang),
    [revealed, setRevealed] = useState(false),
    [complete, setComplete] = useState(false),
    [height, setHeight] = useState(760);
  const source = useRef("/pixel-perfect/flash-hunt.html?lang=" + initialLang);
  function send(data: object) {
    frame.current?.contentWindow?.postMessage(data, location.origin);
  }
  function configure() {
    try {
      if (
        !document.cookie
          .split(";")
          .some((value) => value.trim().startsWith("pixel-perfect-lang="))
      ) {
        const saved = localStorage.getItem("pixel-perfect-lang");
        if (saved === "es" || saved === "en") language(saved, false);
      }
    } catch {}
    send({ type: "pixel-perfect-language", lang: langRef.current, copy });
    try {
      if (localStorage.getItem("pixel-perfect-visited") === "1")
        send({ type: "pixel-perfect-return" });
    } catch {}
  }
  function language(next: Language, manual = true) {
    if (next === langRef.current) return;
    langRef.current = next;
    setLang(next);
    try {
      document.cookie =
        "pixel-perfect-lang=" +
        next +
        "; Path=/; Max-Age=31536000; SameSite=Lax";
      localStorage.setItem("pixel-perfect-lang", next);
    } catch {}
    send({ type: "pixel-perfect-language", lang: next });
    if (manual)
      try {
        track("language_change", { lang: next });
      } catch {}
  }
  useEffect(() => {
    document.documentElement.lang = lang;
    send({ type: "pixel-perfect-language", lang });
  }, [lang]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      const d = event.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "pixel-perfect-ready") configure();
      if (
        d.type === "pixel-perfect-effects-request" &&
        typeof d.enabled === "boolean"
      )
        setEffectsChoice(d.enabled);
      if (
        d.type === "pixel-perfect-language-request" &&
        (d.lang === "es" || d.lang === "en")
      )
        language(d.lang);
      if (d.type === "pixel-perfect-reveal") {
        setRevealed(true);
        window.scrollTo(0, 0);
      }
      if (d.type === "pixel-perfect-complete") {
        completed.current = true;
        setRevealed(true);
        setComplete(true);
        window.scrollTo(0, 0);
        try {
          localStorage.setItem("pixel-perfect-visited", "1");
        } catch {}
      }
      if (
        d.type === "pixel-perfect-height" &&
        typeof d.height === "number" &&
        Number.isFinite(d.height)
      )
        setHeight((previous) => {
          const next = Math.max(1, Math.min(2200, Math.ceil(d.height)));
          return Math.abs(next - previous) > 2 ? next : previous;
        });
      if (d.type === "pixel-perfect-event" && allowedEvents.has(d.name)) {
        const properties: Record<string, string | number> = {
          lang: langRef.current,
        };
        if (
          d.name === "presave_click" &&
          ["intro", "game", "final", "keepsake"].includes(d.location)
        )
          properties.location = d.location;
        if (
          d.name === "share_click" &&
          ["native", "whatsapp", "copy"].includes(d.method)
        )
          properties.method = d.method;
        if (
          d.name === "flash_hunt_capture" &&
          Number.isInteger(d.capture) &&
          d.capture >= 1 &&
          d.capture <= 4
        )
          properties.capture = d.capture;
        try {
          track(d.name, properties);
        } catch {}
      }
    };
    window.addEventListener("message", receive);
    send({ type: "pixel-perfect-handshake" });
    return () => window.removeEventListener("message", receive);
    // The frame stays mounted; language changes never reload the game or its audio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (complete) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [complete]);
  function replay() {
    completed.current = false;
    setComplete(false);
    setRevealed(false);
    send({ type: "pixel-perfect-replay" });
    window.scrollTo(0, 0);
  }
  const reward = (
    <section
      className={complete ? styles.reward : styles.overlay}
      aria-label={copy[lang][complete ? "rewardLabel" : "gameLabel"]}
    >
      <iframe
        ref={frame}
        onLoad={configure}
        src={source.current}
        title="Pixel Perfect — Flash Hunt"
        allow="autoplay; web-share"
        className={styles.frame}
        style={complete ? { height } : undefined}
      />
    </section>
  );
  return (
    <ReleaseLanding
      lang={lang}
      onLanguage={language}
      revealed={revealed}
      complete={complete}
      reward={reward}
      onReplay={replay}
      onEffects={notifyEffects}
      onFlash={notifyFlash}
      effectsEnabled={effectsChoice}
      onEffectsChange={setEffectsChoice}
    />
  );
}
