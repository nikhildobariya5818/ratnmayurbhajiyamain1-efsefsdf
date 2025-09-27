import { type NextRequest, NextResponse } from "next/server"
import type { Order } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // In a real app, you would fetch the order from the database
    // For demo purposes, we'll create a mock order
    const mockOrder: Order = {
      _id: orderId,
      numberOfPeople: 150,
      address: "Wedding Hall, Satellite Road, Ahmedabad",
      orderType: "Wedding",
      orderDate: new Date("2024-12-25"),
      orderTime: "18:00",
      menuItems: [
        {
          menuItemId: "1",
          name: "Onion Bhajiya",
          category: "Traditional",
          type: "dish_with_chart",
          selectedType: "dish_with_chart",
          ingredients: [
            { ingredientId: "1", ingredientName: "Besan (Gram Flour)", unit: "kg", quantityPer100: 2.5 },
            { ingredientId: "2", ingredientName: "Onions", unit: "kg", quantityPer100: 3.0 },
            { ingredientId: "3", ingredientName: "Green Chilies", unit: "gram", quantityPer100: 200 },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate HTML content for the PDF
    const htmlContent = generateHTMLReport(mockOrder)

    // Return HTML content that can be converted to PDF on the client side
    return new NextResponse(
      JSON.stringify({
        html: htmlContent,
        orderId: orderId,
        orderData: mockOrder,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateHTMLReport(order: Order): string {
  // Calculate total ingredients needed
  const ingredientTotals = new Map<string, { name: string; unit: string; total: number }>()

  order.menuItems.forEach((item) => {
    item.ingredients.forEach((ing) => {
      const scaledQuantity = (ing.quantityPer100 * order.numberOfPeople) / 100
      const existing = ingredientTotals.get(ing.ingredientId)
      if (existing) {
        existing.total += scaledQuantity
      } else {
        ingredientTotals.set(ing.ingredientId, {
          name: ing.ingredientName,
          unit: ing.unit,
          total: scaledQuantity,
        })
      }
    })
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Report - ${order._id}</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #2563eb; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 30px;
          border-radius: 8px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .header p {
          color: #64748b;
          margin: 0;
          font-size: 16px;
        }
        .section { 
          margin-bottom: 30px; 
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
        }
        .section h2 { 
          color: #1e40af; 
          border-bottom: 2px solid #3b82f6; 
          padding-bottom: 8px; 
          margin-top: 0;
          font-size: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .info-item {
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
        .info-label {
          font-weight: bold;
          color: #475569;
          font-size: 14px;
        }
        .info-value {
          color: #1e293b;
          font-size: 16px;
          margin-top: 2px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 15px;
          background: white;
        }
        th, td { 
          border: 1px solid #d1d5db; 
          padding: 12px 8px; 
          text-align: left; 
        }
        th { 
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        td {
          font-size: 14px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .menu-item {
          margin-bottom: 15px;
          padding: 15px;
          background: #f1f5f9;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }
        .menu-item-name {
          font-weight: bold;
          color: #065f46;
          font-size: 16px;
        }
        .menu-item-details {
          color: #374151;
          font-size: 14px;
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .highlight {
          background: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        @media print {
          body { margin: 0; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🍽️ Catering Order Report</h1>
        <p>Professional Bhajiya Catering Services</p>
      </div>
      
      <div class="section">
        <h2>📋 Order Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Order ID</div>
            <div class="info-value">${order._id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Order Type</div>
            <div class="info-value">${order.orderType}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Number of People</div>
            <div class="info-value highlight">${order.numberOfPeople}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date & Time</div>
            <div class="info-value">${new Date(order.orderDate).toLocaleDateString()} at ${order.orderTime}</div>
          </div>
        </div>
        <div class="info-item" style="margin-top: 15px;">
          <div class="info-label">Event Address</div>
          <div class="info-value">${order.address}</div>
        </div>
      </div>

      <div class="section">
        <h2>🍛 Menu Items</h2>
        ${order.menuItems
          .map(
            (item) => `
          <div class="menu-item">
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-details">
              Category: ${item.category} | Type: ${item.selectedType?.replace(/_/g, " ") || item.type.replace(/_/g, " ")} | 
              Ingredients: ${item.ingredients.length}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="section">
        <h2>📊 Ingredient Requirements</h2>
        <p style="margin-bottom: 15px; color: #64748b;">
          Total ingredients needed for <span class="highlight">${order.numberOfPeople} people</span>
        </p>
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Ingredient Name</th>
              <th class="text-right" style="width: 25%;">Required Quantity</th>
              <th class="text-center" style="width: 25%;">Unit</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from(ingredientTotals.values())
              .map(
                (ing) => `
              <tr>
                <td>${ing.name}</td>
                <td class="text-right"><strong>${ing.total.toFixed(2)}</strong></td>
                <td class="text-center">${ing.unit}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Catering Management System | Professional Bhajiya Catering Services</p>
        <p style="margin-top: 10px; font-style: italic;">Thank you for choosing our catering services!</p>
      </div>
    </body>
    </html>
  `
}
