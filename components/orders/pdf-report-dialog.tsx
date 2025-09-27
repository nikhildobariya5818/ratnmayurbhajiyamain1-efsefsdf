"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PDFReport } from "./pdf-report"
import type { Order } from "@/lib/types"

interface PDFReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function PDFReportDialog({ open, onOpenChange, order }: PDFReportDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Order Report - PDF Preview</DialogTitle>
        </DialogHeader>
        <PDFReport order={order} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
