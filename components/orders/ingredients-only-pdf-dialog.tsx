"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Order } from "@/lib/types"
import { IngredientsOnlyReport } from "./ingredients-only-report"

interface IngredientsOnlyPDFDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function IngredientsOnlyPDFDialog({ open, onOpenChange, order }: IngredientsOnlyPDFDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Ingredients - PDF Preview</DialogTitle>
        </DialogHeader>
        <IngredientsOnlyReport order={order} />
      </DialogContent>
    </Dialog>
  )
}
