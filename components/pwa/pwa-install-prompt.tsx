"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInWebAppiOS = (window.navigator as any).standalone === true

    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true)
      return
    }

    if (sessionStorage.getItem("pwa-install-dismissed")) {
      return
    }

    const handler = (e: Event) => {
      console.log("[v0] PWA install prompt event triggered")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a short delay for better UX
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 2000)
    }

    const appInstalledHandler = () => {
      console.log("[v0] PWA app installed")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", appInstalledHandler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener("appinstalled", appInstalledHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      console.log("[v0] Triggering PWA install prompt")
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
        console.log("[v0] PWA installation accepted")
      } else {
        console.log("[v0] PWA installation dismissed")
      }
    } catch (error) {
      console.error("[v0] PWA installation error:", error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem("pwa-install-dismissed", "true")
    console.log("[v0] PWA install prompt dismissed")
  }

  // Don't show if already installed or dismissed in this session
  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-sm text-orange-900">Install App</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-orange-600 hover:text-orange-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs text-orange-700">
          Install Ratn Mayur Bhajiya app for quick access, offline use, and better performance
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={handleInstall} className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Install Now
        </Button>
        <p className="text-xs text-orange-600 mt-2 text-center">Works offline • Fast loading • Native experience</p>
      </CardContent>
    </Card>
  )
}
