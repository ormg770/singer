import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { acceptedLanguage } from "@/lib/pixel-perfect-language";
import FlashHuntExperience from "./flash-hunt-experience";

export const viewport: Viewport = { viewportFit: "cover" };

export const metadata: Metadata = {
  title: "Diana Mae — New Music Preview",
  description:
    "Something new is coming. Listen to an exclusive short clip from Diana Mae's upcoming single.",
  alternates: {
    canonical: "https://www.dianamae.com/pixel-perfect",
  },
  openGraph: {
    title: "Diana Mae — New Music Preview",
    description: "Listen to a short clip. New music coming October 26, 2026.",
    url: "https://www.dianamae.com/pixel-perfect",
    type: "website",
    images: [
      {
        url: "https://www.dianamae.com/pixel-perfect/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Diana Mae — Listen to a short clip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diana Mae — New Music Preview",
    description: "Listen to a short clip.",
    images: [
      "https://www.dianamae.com/pixel-perfect/opengraph-image.jpg",
    ],
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
