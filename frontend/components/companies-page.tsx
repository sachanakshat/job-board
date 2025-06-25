"use client"

import { useState, useEffect } from "react"
import { Brain } from "lucide-react"
import { CompanyResearchForm } from "./companies/CompanyResearchForm"
import { CompanyHeaderCard } from "./companies/CompanyHeaderCard"
import { CompanyErrorAlert } from "./companies/CompanyErrorAlert"
import { CompanyLoadingSkeleton } from "./companies/CompanyLoadingSkeleton"
import { CompanyExampleGrid } from "./companies/CompanyExampleGrid"
import { CompanySectionGrid } from "./companies/CompanySectionGrid"
import { CompanySummaryCard } from "./companies/CompanySummaryCard"
import { CompanySourcesCard } from "./companies/CompanySourcesCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CompanyResearchResult {
  status: string
  company_name: string
  company_location: string
  information?: string
  research_results?: string
  search_results_used?: boolean
  research_method: string
  error?: string
  // Structured format fields
  sections?: {
    [key: string]: {
      content: string
      sources: string[]
    }
  }
  all_sources?: string[]
  urls?: string[]
  summary?: {
    total_sections: number
    sections_with_data: number
    total_sources: number
  }
  last_updated?: string
}

interface AvailableProviders {
  llm_providers: string[]
  research_types: string[]
}

// Helper function to check if a string is valid JSON
function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// Helper function to parse JSON string to sections format
function parseJsonToSections(jsonString: string): { [key: string]: { content: string; sources: string[] } } {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed
  } catch (e) {
    console.error('Failed to parse JSON string:', e)
    return {}
  }
}

export function CompaniesPage() {
  const [companyName, setCompanyName] = useState("")
  const [companyLocation, setCompanyLocation] = useState("")
  const [researchType, setResearchType] = useState<"quick" | "comprehensive" | "structured">("quick")
  const [llmProvider, setLlmProvider] = useState("groq")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompanyResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRawContent, setShowRawContent] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<AvailableProviders | null>(null)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const fetchAvailableProviders = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/providers')
      const data = await response.json()
      if (data.status === "success") {
        setAvailableProviders(data.providers)
      }
    } catch (err) {
      console.warn("Could not fetch available providers")
    }
  }

  // Fetch available providers on component mount
  useEffect(() => {
    fetchAvailableProviders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyName.trim() || !companyLocation.trim()) {
      setError("Please fill in both company name and location")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const endpoint = researchType === "structured" 
        ? "/api/company-info/structured" 
        : "/api/company-info"

      const requestBody: {
        company_name: string
        company_location: string
        llm_provider: string
        research_type?: string
      } = {
        company_name: companyName.trim(),
        company_location: companyLocation.trim(),
        llm_provider: llmProvider,
      }

      // Add research_type for non-structured requests
      if (researchType !== "structured") {
        requestBody.research_type = researchType
      }

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (data.status === "success") {
        setResult(data)
      } else {
        setError(data.message || "Failed to research company")
      }
    } catch (err) {
      setError("Failed to connect to the research service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Research</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Company Research
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive insights about any company using advanced AI and web search technology
          </p>
        </div>

        {/* Research Form */}
        <CompanyResearchForm
          companyName={companyName}
          setCompanyName={setCompanyName}
          companyLocation={companyLocation}
          setCompanyLocation={setCompanyLocation}
          researchType={researchType}
          setResearchType={setResearchType}
          llmProvider={llmProvider}
          setLlmProvider={setLlmProvider}
          availableProviders={availableProviders}
          loading={loading}
          showAdvancedOptions={showAdvancedOptions}
          setShowAdvancedOptions={setShowAdvancedOptions}
          onSubmit={handleSubmit}
        />

        {/* Error Display */}
        {error && <CompanyErrorAlert error={error} />}

        {/* Loading State */}
        {loading && <CompanyLoadingSkeleton />}

        {/* Results Display */}
        {result && result.status === "success" && (
          <div className="space-y-8">
            {/* Company Header */}
            <CompanyHeaderCard
              companyName={result.company_name}
              companyLocation={result.company_location}
              researchMethod={result.research_method}
              searchResultsUsed={result.search_results_used}
            />

            {/* Company Information Sections */}
            {result.information && (
              <CompanySectionGrid
                information={result.information}
                showRawContent={showRawContent}
                setShowRawContent={setShowRawContent}
              />
            )}
            
            {/* Comprehensive Research Results */}
            {result.research_results && !result.sections && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Comprehensive Analysis</CardTitle>
                      <CardDescription>Detailed AI-powered research results</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                        h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                        h3: ({children}) => <h3 className="text-lg font-semibold mb-2 text-foreground">{children}</h3>,
                        p: ({children}) => <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="text-muted-foreground">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                        em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                      }}
                    >
                      {result.research_results}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Structured Research Results */}
            {(result.sections || (result.research_results && isJsonString(result.research_results))) && (
              <div className="space-y-6">
                {/* Summary Stats */}
                {result.summary && (
                  <CompanySummaryCard
                    summary={result.summary}
                    lastUpdated={result.last_updated}
                  />
                )}

                {/* Structured Sections */}
                <CompanySectionGrid
                  sections={result.sections || (result.research_results ? parseJsonToSections(result.research_results) : {})}
                  allSources={result.all_sources || result.urls || []}
                  information=""
                  showRawContent={false}
                  setShowRawContent={() => {}}
                />

                {/* All Sources */}
                {(result.all_sources || result.urls) && (result.all_sources || result.urls)!.length > 0 && (
                  <CompanySourcesCard sources={result.all_sources || result.urls || []} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Example Usage */}
        {!result && !loading && (
          <CompanyExampleGrid
            setCompanyName={setCompanyName}
            setCompanyLocation={setCompanyLocation}
          />
        )}
      </div>
    </div>
  )
} 