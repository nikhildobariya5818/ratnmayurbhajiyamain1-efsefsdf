import type React from "react"
import type { Metadata } from "next"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ratn Mayur Bhajiya" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <link rel="apple-touch-icon" href="/icon-192x192.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LanguageProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
          </Suspense>
          <main className="min-h-screen">{children}</main>
          <PWAInstallPrompt />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
