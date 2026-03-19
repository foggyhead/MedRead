import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://med-read-by-harsha.vercel.app"),
  title: {
    default: "MedRead — Medicine Label Reader in Plain Language",
    template: "%s | MedRead",
  },
  description:
    "Upload a photo of any medicine strip or label and get an instant plain language explanation. No medical jargon. Works in Hindi & English. Built for Indian families.",
  keywords: [
    "medicine label reader",
    "medicine in plain language",
    "read medicine label Hindi",
    "what is this medicine",
    "medicine side effects plain language",
    "prescription reader India",
  ],
  authors: [{ name: "MedRead" }],
  openGraph: {
    title: "MedRead — Your medicine, in plain language",
    description:
      "Point. Scan. Understand. Upload any medicine photo and get a clear, jargon-free explanation instantly.",
    url: "https://med-read-by-harsha.vercel.app",
    siteName: "MedRead",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "MedRead — Medicine Label Reader",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedRead — Your medicine, in plain language",
    description:
      "Upload any medicine photo and get a clear, jargon-free explanation instantly.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#030d0a" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
