import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ ONLY THIS PART CHANGED
export const metadata = {
  title: "dsalksj - Gaming Platform",
  description:
    "Explore latest gaming news, downloads, trending posts and premium gaming content on dsalksj.",

  keywords: [
    "gaming",
    "game downloads",
    "gaming news",
    "pc games",
    "latest games",
    "dsalksj"
  ],

  authors: [{ name: "dsalksj" }],
  creator: "dsalksj",

  openGraph: {
    title: "dsalksj - Gaming Platform",
    description:
      "Explore latest gaming news, downloads, and trending gaming content.",
    url: "https://dsalksj.in",
    siteName: "dsalksj",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "dsalksj Gaming Platform"
      }
    ],
    locale: "en_IN",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "dsalksj - Gaming Platform",
    description:
      "Explore latest gaming news, downloads, and trending gaming content.",
    images: ["/og-image.png"]
  },

  metadataBase: new URL("https://dsalksj.in")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}