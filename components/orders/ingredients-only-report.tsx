"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { scaleIngredients, scaleIngredientsWithDualValues } from "@/lib/database"
import { IngredientsOnlyPDF } from "./pdf/IngredientsOnlyPDF"
import { generatePDFFilename } from "@/lib/pdf-utils"

export function IngredientsOnlyReport({ order }: { order: Order }) {
  const hasDualValues = order.menuItems.some((item) =>
    item.ingredients.some((ing) => ing.singleItems && ing.multiItems),
  )

  const scaledIngredients = hasDualValues
    ? scaleIngredientsWithDualValues(order.menuItems, order.numberOfPeople)
    : scaleIngredients(order.menuItems, order.numberOfPeople)

  const pdfFilename = `${generatePDFFilename(
    order.client?.name || order.clientSnapshot?.name || "Unknown_Client",
    order.orderDate,
  ).replace(".pdf", "")}-ingredients.pdf`

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <Card className="border-2">
        <CardHeader className="pb-3 bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ingredient Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-0">
            {scaledIngredients.map((ingredient, index) => (
              <div
                key={`${ingredient.ingredientName}-${index}`}
                className={`flex justify-between items-center py-3 ${
                  index !== scaledIngredients.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <span className="text-sm font-medium">{ingredient.ingredientName}</span>
                <span className="text-sm font-semibold">
                  {ingredient.totalQuantity} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <PDFDownloadLink document={<IngredientsOnlyPDF order={order} />} fileName={pdfFilename}>
          {({ loading }) => (
            <Button className="flex items-center gap-2" disabled={loading}>
              <Download className="h-4 w-4" />
              {loading ? "Generating PDF..." : "Download Ingredients PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  )
}
