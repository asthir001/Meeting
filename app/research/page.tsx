"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, Globe, FileText, CheckCircle } from "lucide-react"

const processingSteps = [
  { id: 1, title: "Generating search queries...", icon: Search },
  { id: 2, title: "Searching the web...", icon: Globe },
  { id: 3, title: "Extracting insights...", icon: FileText },
  { id: 4, title: "Structuring data...", icon: CheckCircle },
]

export default function ResearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const companyName = searchParams.get("company")
  const projectDomain = searchParams.get("domain")

  useEffect(() => {
    if (!companyName || !projectDomain) {
      router.push("/")
      return
    }

    const processResearch = async () => {
      try {
        // Simulate processing steps
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStep(i)
          setProgress((i / processingSteps.length) * 100)

          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }

        // Start the actual research process
        const response = await fetch("/api/research", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            projectDomain,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setProgress(100)
          setIsComplete(true)

          // Redirect to results page after a brief delay
          setTimeout(() => {
            router.push(`/results?id=${data.researchId}`)
          }, 1000)
        } else {
          throw new Error("Research failed")
        }
      } catch (error) {
        console.error("Research error:", error)
        // Handle error - could redirect to error page or show error message
      }
    }

    processResearch()
  }, [companyName, projectDomain, router])

  if (!companyName || !projectDomain) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Researching {companyName}</h1>
                <p className="text-gray-600">Project Domain: {projectDomain}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                  {processingSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep || isComplete

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : isCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Icon className={`h-5 w-5 ${isCompleted ? "text-green-600" : ""}`} />
                        )}
                        <span className="font-medium">{step.title}</span>
                        {isCompleted && !isActive && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                      </div>
                    )
                  })}
                </div>

                {isComplete && (
                  <div className="text-center pt-4">
                    <div className="inline-flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Research Complete!</span>
                    </div>
                    <p className="text-gray-600 mt-2">Redirecting to results...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
