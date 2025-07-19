"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Search, FileText, Download } from "lucide-react"

export default function HomePage() {
  const [companyName, setCompanyName] = useState("")
  const [projectDomain, setProjectDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !projectDomain.trim()) return

    setIsLoading(true)

    // Store the research parameters and redirect to processing page
    const searchParams = new URLSearchParams({
      company: companyName,
      domain: projectDomain,
    })

    router.push(`/research?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Consultant's Company Insight Hub</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automate deep company research for client meetings and project proposals. Get comprehensive, sourced
            insights in minutes.
          </p>
        </div>

        {/* Main Input Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-800">Start Your Research</CardTitle>
              <CardDescription className="text-lg">
                Enter company details to generate comprehensive insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-base font-medium">
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g., Microsoft, Tesla, Shopify"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-base font-medium">
                    Project Domain *
                  </Label>
                  <Input
                    id="domain"
                    type="text"
                    placeholder="e.g., Digital Transformation, Supply Chain Optimization, Customer Experience"
                    value={projectDomain}
                    onChange={(e) => setProjectDomain(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || !companyName.trim() || !projectDomain.trim()}
                >
                  {isLoading ? (
                    <>
                      <Search className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Generate Research
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p className="text-gray-600">Mission, vision, leadership, and company structure</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                <p className="text-gray-600">Position, competition, and industry trends</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">PDF Export</h3>
                <p className="text-gray-600">Professional report ready for client meetings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
