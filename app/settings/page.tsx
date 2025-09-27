"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/i18n"
import { Globe, Settings } from "lucide-react"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-balance">{t.settings}</h1>
        </div>
        <p className="text-muted-foreground">{t.systemSettings}</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>{t.language}</CardTitle>
                <CardDescription>{t.selectLanguage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language-select">{t.language}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language-select" className="w-full">
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

        {/* Additional settings can be added here */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Application details and version information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build:</span>
                <span>Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
