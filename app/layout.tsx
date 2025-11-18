import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/layout/navigation"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ratn Mayur Bhajiya - Catering Management",
  description: "Professional catering management system for Ratn Mayur Bhajiya by Sureshbhai",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["catering", "management", "bhajiya", "orders", "ingredients", "ratn", "mayur", "sureshbhai"],
  authors: [{ name: "Sureshbhai - Ratn Mayur Bhajiya" }],
  icons: {
    icon: "/icon-192x192.jpg",
    shortcut: "/icon-192x192.jpg",
    apple: "/icon-192x192.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ratn Mayur Bhajiya",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Ratn Mayur Bhajiya",
    title: "Ratn Mayur Bhajiya - Catering Management",
    description: "Professional catering management system for Ratn Mayur Bhajiya by Sureshbhai",
  },
  twitter: {
    card: "summary",
    title: "Ratn Mayur Bhajiya - Catering Management",
    description: "Professional catering management system for Ratn Mayur Bhajiya by Sureshbhai",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f97316",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="font" href="/fonts/NotoSans-Regular.ttf" type="font/ttf" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ratn Mayur Bhajiya" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <link rel="apple-touch-icon" href="/icon-192x192.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <LanguageProvider>
          <Suspense fallback={<div className="h-14 md:h-16 bg-background border-b" />}>
            <Navigation />
          </Suspense>
          <main className="min-h-screen overflow-hidden">{children}</main>
          <PWAInstallPrompt />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
