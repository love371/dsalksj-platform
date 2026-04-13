import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // ✅ ADD THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "dsalksj - Gaming Platform",
  description:
    "Explore latest gaming news, downloads, trending posts and premium gaming content on dsalksj.",

  verification: {
    google: "umTfEKZBwWqjygrRagvNjqRQq5fqZO2f3AM2uFDIBhQ"
  },

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
      
      {/* ✅ ADD GOOGLE ANALYTICS HERE */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6CHLF4KS6V');
        `}
      </Script>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}