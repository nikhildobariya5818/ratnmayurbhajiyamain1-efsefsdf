"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users, Package, ChefHat, FileText, BarChart3, Settings, Home } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const navigation = [
    { name: t.dashboard, href: "/", icon: Home },
    { name: t.clients, href: "/clients", icon: Users },
    { name: t.ingredients, href: "/ingredients", icon: Package },
    { name: t.menuItems, href: "/menu-items", icon: ChefHat },
    { name: t.orders, href: "/orders", icon: FileText },
    // { name: t.reports, href: "/reports", icon: BarChart3 },
    { name: t.settings, href: "/settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <ChefHat className="h-6 w-6 text-orange-600" />
            <span className="hidden font-bold sm:inline-block text-orange-900">{t.ratnMayurBhajiya}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t.toggleMenu}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link className="flex items-center space-x-2" href="/" onClick={() => setOpen(false)}>
              <ChefHat className="h-6 w-6 text-orange-600" />
              <span className="font-bold text-orange-900">{t.ratnMayurBhajiya}</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                        pathname === item.href ? "text-foreground" : "text-foreground/60",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link className="inline-flex items-center space-x-2 md:hidden" href="/">
              <ChefHat className="h-6 w-6 text-orange-600" />
              <span className="font-bold text-orange-900">{t.ratnMayurBhajiya}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
