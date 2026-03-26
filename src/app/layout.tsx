import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/src/index.css";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const viewport: Viewport = {
  themeColor: "#30221e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Morabaraba | Traditional African Strategy Game",
  description: "Play the ancient game of Morabaraba online. A beautiful, culturally respectful implementation of the South African board game. Master the art of the 12 cows.",
  manifest: "/manifest.json",
  keywords: ["Morabaraba", "African Board Game", "Strategy Game", "South Africa", "Mapungubwe", "Cows", "Mills", "PWA"],
  authors: [{ name: "Morabaraba Digital Heritage" }],
  openGraph: {
    title: "Morabaraba | Traditional African Strategy Game",
    description: "Master the art of the 12 cows in this beautiful digital rendition of the ancient South African strategy game.",
    url: "https://morabaraba.app",
    siteName: "Morabaraba Digital Heritage",
    images: [
      {
        url: "https://picsum.photos/seed/morabaraba-og/1200/630",
        width: 1200,
        height: 630,
        alt: "Morabaraba Game Board",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morabaraba | Traditional African Strategy Game",
    description: "The ancient strategy game of South Africa. Master the art of the 12 cows.",
    images: ["https://picsum.photos/seed/morabaraba-og/1200/630"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Morabaraba",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="antialiased bg-[#30221e] text-[#fdf8f6] min-h-screen flex flex-col">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
