import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params

    // In a real app, you would fetch the PDF from storage
    // For demo purposes, we'll return a simple PDF-like response
    const mockPdfContent = `Mock PDF content for report ${reportId}`
    const pdfBuffer = Buffer.from(mockPdfContent, "utf-8")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error downloading PDF:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}
