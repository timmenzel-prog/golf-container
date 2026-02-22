import type { Metadata } from "next";
import "./globals.css";
import { Lato } from "next/font/google";
import Script from "next/script";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://golf-container.com"),

  title: {
    default: "Golf Simulator Container – Golf Container by PRO1PUTT",
    template: "%s · Golf Container by PRO1PUTT",
  },

  description:
    "Golf Simulator Container by PRO1PUTT: modulare Premium-Container für wetterunabhängiges Golftraining. Planung, Innenausbau & Lieferung – die Basis für dein Simulator-Projekt.",

  alternates: {
    canonical: "https://golf-container.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  openGraph: {
    title: "Golf Simulator Container – Golf Container by PRO1PUTT",
    description:
      "Modulare Premium-Container als Basis für Golf-Simulatoren – wetterunabhängiges Training, Planung & Lieferung aus einer Hand.",
    url: "https://golf-container.com",
    siteName: "Golf Container by PRO1PUTT",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Golf Simulator Container – Golf Container by PRO1PUTT",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Golf Simulator Container – Golf Container by PRO1PUTT",
    description:
      "Premium-Container als Basis für Golf-Simulatoren – wetterunabhängiges Training, geplant & geliefert aus einer Hand.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Golf Container by PRO1PUTT",
    url: "https://golf-container.com",
    logo: "https://golf-container.com/og.jpg"
  };

  return (
    <html lang="de">
      <body className={lato.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}