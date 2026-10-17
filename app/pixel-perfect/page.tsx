import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { acceptedLanguage } from "@/lib/pixel-perfect-language";
import FlashHuntExperience from "./flash-hunt-experience";

export const viewport: Viewport = { viewportFit: "cover" };

export const metadata: Metadata = {
  title: "Pixel Perfect — Diana Mae",
  description:
    "A new era. Pixel Perfect by Diana Mae. Out October 26, 2026. Pre-save now. Nuevo sencillo.",
  alternates: { canonical: "https://dianamae.com/pixel-perfect" },
  openGraph: {
    title: "Pixel Perfect — Diana Mae",
    description: "Out October 26, 2026. Pre-save now.",
    url: "https://dianamae.com/pixel-perfect",
    images: [
      {
        url: "https://dianamae.com/pixel-perfect-cover-v2.jpg",
        width: 3000,
        height: 3000,
        alt: "Pixel Perfect by Diana Mae — official cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://dianamae.com/pixel-perfect-cover-v2.jpg"],
  },
};

export default async function PixelPerfectPage() {
  const saved = (await cookies()).get("pixel-perfect-lang")?.value;
  const initialLang =
    saved === "es" || saved === "en"
      ? saved
      : acceptedLanguage((await headers()).get("accept-language"));
  return <FlashHuntExperience initialLang={initialLang} />;
}
