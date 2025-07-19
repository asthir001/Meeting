"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  ExternalLink,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Megaphone,
  Globe,
  Newspaper,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"

interface ResearchData {
  id: string
  companyName: string
  projectDomain: string
  generatedAt: string
  sections: {
    overview: any
    products: any
    market: any
    financial: any
    customers: any
    marketing: any
    online: any
    news: any
    challenges: any
    valueProposition: any
  }
}

const sectionIcons = {
  overview: Building2,
  products: Target,
  market: TrendingUp,
  financial: DollarSign,
  customers: Users,
  marketing: Megaphone,
  online: Globe,
  news: Newspaper,
  challenges: AlertTriangle,
  valueProposition: Lightbulb,
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  const researchId = searchParams.get("id")

  useEffect(() => {
    if (!researchId) {
      router.push("/")
      return
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/research/${researchId}`)
        if (response.ok) {
          const data = await response.json()
          setResearchData(data)
        } else {
          throw new Error("Failed to fetch results")
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [researchId, router])

  const handleDownloadPDF = async () => {
    if (!researchData) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/research/${researchId}/pdf`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${researchData.companyName}-research-report.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading research results...</p>
        </div>
      </div>
    )
  }

  if (!researchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Research data not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Start New Research
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{researchData.companyName} - Research Report</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <Badge variant="secondary">{researchData.projectDomain}</Badge>
                <span>Generated: {new Date(researchData.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700">
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Research Sections */}
        <div className="space-y-6">
          {/* Company Overview */}
          <ResearchSection title="Company Overview" icon={Building2} data={researchData.sections.overview} />

          {/* Products and Services */}
          <ResearchSection title="Products and Services" icon={Target} data={researchData.sections.products} />

          {/* Market Position & Industry */}
          <ResearchSection title="Market Position & Industry" icon={TrendingUp} data={researchData.sections.market} />

          {/* Financial Information */}
          <ResearchSection title="Financial Information" icon={DollarSign} data={researchData.sections.financial} />

          {/* Customer Base */}
          <ResearchSection title="Customer Base" icon={Users} data={researchData.sections.customers} />

          {/* Marketing & Sales Strategy */}
          <ResearchSection title="Marketing & Sales Strategy" icon={Megaphone} data={researchData.sections.marketing} />

          {/* Online Presence & Reputation */}
          <ResearchSection title="Online Presence & Reputation" icon={Globe} data={researchData.sections.online} />

          {/* Recent News & Developments */}
          <ResearchSection title="Recent News & Developments" icon={Newspaper} data={researchData.sections.news} />

          {/* Pain Points & Opportunities */}
          <ResearchSection
            title="Pain Points & Opportunities"
            icon={AlertTriangle}
            data={researchData.sections.challenges}
          />

          {/* Value Proposition */}
          <ResearchSection
            title="Your Value Proposition (Contextual)"
            icon={Lightbulb}
            data={researchData.sections.valueProposition}
            isValueProp={true}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Button onClick={() => router.push("/")} variant="outline" className="mr-4">
            Start New Research
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700">
            {isDownloading ? "Generating PDF..." : "Download Report"}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ResearchSectionProps {
  title: string
  icon: any
  data: any
  isValueProp?: boolean
}

function ResearchSection({ title, icon: Icon, data, isValueProp = false }: ResearchSectionProps) {
  if (!data || !data.content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">No information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </CardTitle>
        {isValueProp && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <strong>Note:</strong> This is a suggested value proposition based on the research findings.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(data.content) ? (
            data.content.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                {item.subtitle && <h4 className="font-semibold text-gray-800">{item.subtitle}</h4>}
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
                {item.sources && item.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.sources.map((source: any, sourceIndex: number) => (
                      <a
                        key={sourceIndex}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Source {sourceIndex + 1}
                      </a>
                    ))}
                  </div>
                )}
                {index < data.content.length - 1 && <Separator className="my-3" />}
              </div>
            ))
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 leading-relaxed">{data.content}</p>
              {data.sources && data.sources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((source: any, sourceIndex: number) => (
                    <a
                      key={sourceIndex}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Source {sourceIndex + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
