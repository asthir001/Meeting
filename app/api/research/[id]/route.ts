import { researchStore } from "@/lib/research-store"
import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a proper database

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const researchId = params.id
    const researchData = researchStore.get(researchId)

    if (!researchData) {
      return NextResponse.json({ error: "Research data not found" }, { status: 404 })
    }

    return NextResponse.json(researchData)
  } catch (error) {
    console.error("Error fetching research data:", error)
    return NextResponse.json({ error: "Failed to fetch research data" }, { status: 500 })
  }
}
