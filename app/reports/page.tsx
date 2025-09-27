"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar, Users, Search, Filter, Loader2 } from "lucide-react"
import { GenerateReportDialog } from "@/components/reports/generate-report-dialog"
import { PreviewReportDialog } from "@/components/reports/preview-report-dialog"
import type { Order, Client } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { fetchOrders } from "@/lib/api/orders"
import { fetchClients } from "@/lib/api/clients"

interface ReportRecord {
  id: string
  orderId: string
  clientName: string
  orderType: string
  orderDate: Date
  numberOfPeople: number
  generatedAt: Date
  status: "generated" | "downloaded"
}

export default function ReportsPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all")
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [ordersData, clientsData] = await Promise.all([fetchOrders(), fetchClients()])
      setOrders(ordersData)
      setClients(clientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Populate client details for display
  const ordersWithClients = orders.map((order) => ({
    ...order,
    client: order.clientId ? clients.find((c) => c._id === order.clientId) : undefined,
  }))

  const reportsWithDetails = reports.map((report) => ({
    ...report,
    order: orders.find((o) => o._id === report.orderId),
  }))

  const filteredReports = reportsWithDetails.filter((report) => {
    const matchesSearch =
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.orderType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedOrderType === "all" || report.orderType === selectedOrderType
    return matchesSearch && matchesType
  })

  const orderTypes = Array.from(new Set(reports.map((report) => report.orderType)))

  const handleGenerateReport = async (order: Order) => {
    try {
      setError(null)

      // Call the API to get HTML content
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const { html, orderId } = await response.json()

      // Create a new window/tab with the HTML content for printing/saving as PDF
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()

        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }

      // Add to reports list
      const client = clients.find((c) => c._id === order.clientId) || order.clientSnapshot
      const newReport: ReportRecord = {
        id: `report-${Date.now()}`,
        orderId: order._id!,
        clientName: client?.name || "Unknown",
        orderType: order.orderType,
        orderDate: new Date(order.orderDate),
        numberOfPeople: order.numberOfPeople,
        generatedAt: new Date(),
        status: "generated",
      }
      setReports([newReport, ...reports])
      setIsGenerateDialogOpen(false)
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error instanceof Error ? error.message : "Failed to generate PDF report")
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      setError(null)
      const report = reports.find((r) => r.id === reportId)
      const order = orders.find((o) => o._id === report?.orderId)

      if (!order) {
        throw new Error("Order not found")
      }

      // Regenerate the PDF
      await handleGenerateReport(order)

      // Update status
      setReports(reports.map((r) => (r.id === reportId ? { ...r, status: "downloaded" as const } : r)))
    } catch (error) {
      console.error("Error downloading report:", error)
      setError(error instanceof Error ? error.message : "Failed to download report")
    }
  }

  const handlePreviewReport = (order: Order) => {
    setSelectedOrder(order)
    setIsPreviewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>{t.loading} reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={loadData}>
                  {t.retry}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">PDF {t.reports}</h1>
            <p className="text-muted-foreground">{t.generatePDFReports}</p>
          </div>
          <Button onClick={() => setIsGenerateDialogOpen(true)} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate {t.reports}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reports by client or order type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedOrderType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedOrderType("all")}
            >
              <Filter className="h-3 w-3 mr-1" />
              All Types
            </Button>
            {orderTypes.map((type) => (
              <Button
                key={type}
                variant={selectedOrderType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedOrderType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total {t.reports}</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Downloaded</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "downloaded").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total People</p>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, report) => sum + report.numberOfPeople, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {
                      reports.filter((report) => {
                        const reportMonth = report.generatedAt.getMonth()
                        const currentMonth = new Date().getMonth()
                        return reportMonth === currentMonth
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.clientName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      {report.numberOfPeople} people
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{report.orderType}</Badge>
                      <Badge
                        variant={report.status === "downloaded" ? "default" : "outline"}
                        className={
                          report.status === "downloaded"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                      >
                        {report.status === "downloaded" ? "Downloaded" : "Generated"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {report.order && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewReport(report.order!)}
                        className="h-8 w-8 p-0"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      className="h-8 w-8 p-0"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">Order Date: </span>
                      {new Date(report.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">Generated: </span>
                      {new Date(report.generatedAt).toLocaleDateString()} at{" "}
                      {new Date(report.generatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedOrderType !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "Get started by generating your first report"}
              </p>
              {!searchTerm && selectedOrderType === "all" && (
                <Button onClick={() => setIsGenerateDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate {t.reports}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <GenerateReportDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        orders={ordersWithClients}
        onGenerate={handleGenerateReport}
      />

      <PreviewReportDialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        order={selectedOrder}
        onGenerate={handleGenerateReport}
      />
    </div>
  )
}
