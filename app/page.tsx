"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ChefHat, FileText, BarChart3, Settings } from 'lucide-react'
import Link from "next/link"
// import { InstallPrompt } from "@/components/pwa/install-prompt"
import { useLanguage } from "@/lib/language-context"
// import { PDFViewer } from "@react-pdf/renderer"
// import { MyDocument } from "@/components/new"

export default function Dashboard() {
  const { t } = useLanguage()

  const modules = [
    {
      title: t.clients,
      description: t.manageClientInfo,
      icon: Users,
      href: "/clients",
      color: "text-blue-600",
    },
    {
      title: t.ingredients,
      description: t.manageIngredients,
      icon: Package,
      href: "/ingredients",
      color: "text-green-600",
    },
    {
      title: t.menuItems,
      description: t.manageBhajiyaVarieties,
      icon: ChefHat,
      href: "/menu-items",
      color: "text-orange-600",
    },
    {
      title: t.orders,
      description: t.createManageOrders,
      icon: FileText,
      href: "/orders",
      color: "text-purple-600",
    },
    // {
    //   title: t.reports,
    //   description: t.generatePDFReports,
    //   icon: BarChart3,
    //   href: "/reports",
    //   color: "text-red-600",
    // },
    {
      title: t.settings,
      description: t.systemSettings,
      icon: Settings,
      href: "/settings",
      color: "text-gray-600",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-balance">{t.cateringManagementSystem}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">{t.manageCateringBusiness}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.href} href={module.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${module.color}`} />
                    <div>
                      <CardTitle className="text-base md:text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs md:text-sm">{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
