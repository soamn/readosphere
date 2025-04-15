import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Readosphere",
    template: "%s | Readosphere",
  },
  description:
    "Readosphere is a blog dedicated to book recommendations, reviews, and summaries.",

  keywords: ["book recommendations", "book reviews", "book summaries"],
  twitter: {
    card: "summary_large_image",
    description: "book recommendations, reviews, and summaries",
  },
};

// export const metadata: Metadata = {
//   title: {
//     default: "Readosphere",
//     template: "%s | Readosphere",
//   },

//   description: "Readosphere is a blog dedicated to book recommendations, reviews, and summaries.",

//   // Basic metadata
//   applicationName: "Readosphere",
//   authors: [
//     { name: "Aman Negi", url: "https://github.com/soamn" },
//   ],
//   generator: "Next.js",
//   keywords: ["book recommendations", "book reviews", "book summaries"],

//   // Referrer policy
//   referrer: "origin-when-cross-origin",

//   // Theme color
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//     { media: "(prefers-color-scheme: dark)", color: "#000000" },
//   ],

//   // Color scheme
//   colorScheme: "light",

//   // Icons
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//     other: [
//       {
//         rel: "mask-icon",
//         url: "/safari-pinned-tab.svg",
//         color: "#5bbad5",
//       },
//     ],
//   },

//   // Manifest
//   manifest: "/site.webmanifest",

//   // Category (mostly for search engines)
//   category: "Books",

//   // Metadata base URL
//   metadataBase: new URL("https://readosphere.com"),

//   // Open Graph
//   openGraph: {
//     title: "Readosphere",
//     description: "The ultimate place for book lovers to find reviews, summaries, and recommendations.",
//     url: "https://readosphere.com",
//     siteName: "Readosphere",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Readosphere Open Graph Image",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },

//   // Twitter Cards
//   twitter: {
//     card: "summary_large_image",
//     site: "@readosphere",
//     creator: "@soamn",
//     title: "Readosphere",
//     description: "Top-tier book reviews and summaries",
//     images: ["/twitter-image.png"],
//   },

//   // Robots meta tags
//   robots: {
//     index: true,
//     follow: true,
//     nocache: false,
//     googleBot: {
//       index: true,
//       follow: true,
//       noimageindex: false,
//       maxVideoPreview: -1,
//       maxImagePreview: "large",
//       maxSnippet: -1,
//     },
//   },

//   // Archives or feed URLs
//   archives: ["https://readosphere.com/feed.xml"],

//   // Canonical link (useful for duplicate pages)
//   alternates: {
//     canonical: "https://readosphere.com",
//     languages: {
//       "en-US": "https://readosphere.com/en-US",
//       "fr-FR": "https://readosphere.com/fr-FR",
//     },
//   },

//   // App Links (for mobile app deep linking)
//   appLinks: {
//     ios: {
//       url: "readosphere://home",
//       app_store_id: "123456789",
//     },
//     android: {
//       url: "https://readosphere.com/app",
//       package: "com.readosphere.app",
//     },
//     web: {
//       url: "https://readosphere.com",
//       should_fallback: true,
//     },
//   },

//   // Verification (for Google, Bing, etc.)
//   verification: {
//     google: "google-site-verification-code",
//     yandex: "yandex-code",
//     other: {
//       me: ["https://github.com/soamn"],
//     },
//   },
// };

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" antialiase  ">{children}</body>
    </html>
  );
}
