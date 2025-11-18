"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/i18n"
import { Globe, Settings } from 'lucide-react'

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Settings className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-balance">{t.settings}</h1>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">{t.systemSettings}</p>
      </div>

      <div className="grid gap-4 md:gap-6 max-w-2xl">
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-start gap-2 md:gap-3">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base md:text-lg">{t.language}</CardTitle>
                <CardDescription className="text-xs md:text-sm">{t.selectLanguage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="language-select" className="text-xs md:text-sm">{t.language}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language-select" className="w-full text-xs md:text-sm">
                  <SelectValue placeholder={t.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span>{t.english}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hi">
                    <div className="flex items-center gap-2">
                      <span>🇮🇳</span>
                      <span>{t.hindi}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gu">
                    <div className="flex items-center gap-2">
                      <span>🇮🇳</span>
                      <span>{t.gujarati}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">System Information</CardTitle>
            <CardDescription className="text-xs md:text-sm">Application details and version information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Build:</span>
                <span className="font-medium">Production</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
