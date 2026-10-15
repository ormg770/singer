import type { Metadata } from "next";
import ReleaseLanding from "./release-landing";

export const metadata: Metadata = {
  title: "Pixel Perfect — Diana Mae",
  description:
    "A new era. Pixel Perfect by Diana Mae. Out October 26, 2026. Pre-save now.",
  alternates: { canonical: "https://dianamae.com/pixel-perfect" },
  openGraph: {
    title: "Pixel Perfect — Diana Mae",
    description: "Out October 26, 2026. Pre-save now.",
    url: "https://dianamae.com/pixel-perfect",
    images: [
      {
        url: "https://dianamae.com/pixel-perfect-cover.jpg",
        width: 1108,
        height: 1108,
        alt: "Pixel Perfect by Diana Mae — official cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://dianamae.com/pixel-perfect-cover.jpg"],
  },
};

export default function PixelPerfectPage() {
  return <ReleaseLanding />;
}
