"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  Building2, 
  MapPin, 
  Search, 
  Loader2, 
  Users, 
  DollarSign, 
  Calendar,
  Globe,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Brain,
  Briefcase,
  Award,
  Lightbulb,
  BarChart3,
  Heart,
  ExternalLink,
  FileText
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
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
  summary?: {
    total_sections: number
    sections_with_data: number
    total_sources: number
  }
  last_updated?: string
}

interface ParsedSection {
  title: string
  content: string
  icon: React.ReactNode
  color: string
}

export function CompaniesPage() {
  const [companyName, setCompanyName] = useState("")
  const [companyLocation, setCompanyLocation] = useState("")
  const [researchType, setResearchType] = useState<"quick" | "comprehensive" | "structured">("quick")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompanyResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRawContent, setShowRawContent] = useState(false)

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
      const endpoint = researchType === "comprehensive" 
        ? "/api/company-info/comprehensive" 
        : researchType === "structured" 
          ? "/api/company-info/structured" 
          : "/api/company-info/quick"

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName.trim(),
          company_location: companyLocation.trim(),
        }),
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

  const parseCompanyInfo = (info: string): ParsedSection[] => {
    console.log("Raw info to parse:", info) // Debug log
    
    const sections: ParsedSection[] = []
    
    // Define section patterns and their styling
    const sectionPatterns = [
      {
        patterns: [/\*\*Company Overview.*?\*\*/i, /Company Overview/i, /Overview/i],
        title: "Company Overview",
        icon: <Building2 className="h-5 w-5" />,
        color: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
      },
      {
        patterns: [/\*\*Founders.*?\*\*/i, /Founders.*Leadership/i, /Leadership/i, /Founders/i],
        title: "Founders & Leadership",
        icon: <Users className="h-5 w-5" />,
        color: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300"
      },
      {
        patterns: [/\*\*Company History.*?\*\*/i, /Company History/i, /History/i, /Founded/i],
        title: "Company History",
        icon: <Calendar className="h-5 w-5" />,
        color: "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300"
      },
      {
        patterns: [/\*\*Funding.*?\*\*/i, /Funding.*Investors/i, /Funding/i, /Investors/i, /Capital/i],
        title: "Funding & Investors",
        icon: <DollarSign className="h-5 w-5" />,
        color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      },
      {
        patterns: [/\*\*Company Size.*?\*\*/i, /Company Size/i, /Employees/i, /Size/i, /Headcount/i],
        title: "Company Size",
        icon: <BarChart3 className="h-5 w-5" />,
        color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300"
      },
      {
        patterns: [/\*\*Demographics.*?\*\*/i, /Demographics/i, /Diversity/i],
        title: "Demographics",
        icon: <Globe className="h-5 w-5" />,
        color: "bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300"
      },
      {
        patterns: [/\*\*Recent.*?\*\*/i, /Recent.*Developments/i, /Recent News/i, /Recent/i, /News/i],
        title: "Recent Developments",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300"
      },
      {
        patterns: [/\*\*Technology.*?\*\*/i, /Technology.*Products/i, /Technology/i, /Products/i, /Tech Stack/i],
        title: "Technology & Products",
        icon: <Lightbulb className="h-5 w-5" />,
        color: "bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300"
      },
      {
        patterns: [/\*\*Market.*?\*\*/i, /Market.*Position/i, /Market/i, /Competitors/i, /Competition/i],
        title: "Market Position",
        icon: <Target className="h-5 w-5" />,
        color: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
      },
      {
        patterns: [/\*\*Culture.*?\*\*/i, /Culture.*Values/i, /Culture/i, /Values/i, /Mission/i],
        title: "Culture & Values",
        icon: <Heart className="h-5 w-5" />,
        color: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
      }
    ]

    // Try multiple parsing strategies
    let parsedSections: ParsedSection[] = []

    // Strategy 1: Split by markdown headers (## or **)
    const headerRegex = /(?:^|\n)(?:##\s*|\*\*)([^*\n]+?)(?:\*\*|$)/g
    let match
    const headers: { title: string; start: number; end: number }[] = []
    
    while ((match = headerRegex.exec(info)) !== null) {
      headers.push({
        title: match[1].trim(),
        start: match.index,
        end: match.index + match[0].length
      })
    }

    console.log("Found headers:", headers) // Debug log

    // If we found headers, extract sections
    if (headers.length > 0) {
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i]
        const nextHeader = headers[i + 1]
        const contentStart = header.end
        const contentEnd = nextHeader ? nextHeader.start : info.length
        const content = info.substring(contentStart, contentEnd).trim()

        if (content) {
          // Find matching pattern
          const pattern = sectionPatterns.find(p => 
            p.patterns.some(pat => pat.test(header.title))
          )
          
          if (pattern) {
            parsedSections.push({
              title: pattern.title,
              content: content,
              icon: pattern.icon,
              color: pattern.color
            })
          } else {
            // Default section for unmatched headers
            parsedSections.push({
              title: header.title,
              content: content,
              icon: <Briefcase className="h-5 w-5" />,
              color: "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300"
            })
          }
        }
      }
    }

    // Strategy 2: If no headers found, try to split by numbered sections
    if (parsedSections.length === 0) {
      const numberedSections = info.split(/(?:\n|^)\d+\.\s*\*\*([^*]+)\*\*/g)
      
      for (let i = 1; i < numberedSections.length; i += 2) {
        const title = numberedSections[i]?.trim()
        const content = numberedSections[i + 1]?.trim()
        
        if (title && content) {
          const pattern = sectionPatterns.find(p => 
            p.patterns.some(pat => pat.test(title))
          )
          
          if (pattern) {
            parsedSections.push({
              title: pattern.title,
              content: content,
              icon: pattern.icon,
              color: pattern.color
            })
          } else {
            parsedSections.push({
              title: title,
              content: content,
              icon: <Briefcase className="h-5 w-5" />,
              color: "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300"
            })
          }
        }
      }
    }

    // Strategy 3: If still no sections, create a single overview section
    if (parsedSections.length === 0) {
      parsedSections.push({
        title: "Company Information",
        content: info,
        icon: <Building2 className="h-5 w-5" />,
        color: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
      })
    }

    console.log("Parsed sections:", parsedSections) // Debug log
    return parsedSections
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
        <Card className="mb-12 border-0 shadow-xl bg-gradient-to-r from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Research Company</CardTitle>
            <CardDescription className="text-lg">
              Enter company details to get detailed information including founders, funding, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="company-name" className="text-sm font-semibold">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="e.g., OpenAI, Stripe, Google"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={loading}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="company-location" className="text-sm font-semibold">Company Location</Label>
                  <Input
                    id="company-location"
                    placeholder="e.g., San Francisco, New York, London"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    disabled={loading}
                    className="h-12 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Research Type</Label>
                <RadioGroup
                  value={researchType}
                  onValueChange={(value: "quick" | "comprehensive" | "structured") => setResearchType(value)}
                  className="grid md:grid-cols-3 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="quick" id="quick" className="sr-only" />
                    <Label 
                      htmlFor="quick" 
                      className={`flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        researchType === "quick" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Zap className="h-8 w-8 mb-3 text-primary" />
                      <span className="font-semibold text-lg mb-1">Quick Research</span>
                      <span className="text-sm text-muted-foreground text-center">Faster, essential information</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="comprehensive" id="comprehensive" className="sr-only" />
                    <Label 
                      htmlFor="comprehensive" 
                      className={`flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        researchType === "comprehensive" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Brain className="h-8 w-8 mb-3 text-primary" />
                      <span className="font-semibold text-lg mb-1">Comprehensive</span>
                      <span className="text-sm text-muted-foreground text-center">Detailed, thorough analysis</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="structured" id="structured" className="sr-only" />
                    <Label 
                      htmlFor="structured" 
                      className={`flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        researchType === "structured" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <BarChart3 className="h-8 w-8 mb-3 text-primary" />
                      <span className="font-semibold text-lg mb-1">Structured</span>
                      <span className="text-sm text-muted-foreground text-center">Detailed, structured analysis</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Researching Company...
                  </>
                ) : (
                  <>
                    <Search className="mr-3 h-5 w-5" />
                    Research Company
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-primary">Researching...</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && result.status === "success" && (
          <div className="space-y-8">
            {/* Company Header */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{result.company_name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg text-muted-foreground">{result.company_location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-4 py-2 text-sm">
                      {result.research_method}
                    </Badge>
                    {result.search_results_used && (
                      <Badge className="px-4 py-2 text-sm bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Web Search
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information Sections */}
            {result.information && (
              <div className="space-y-6">
                {/* Toggle for raw/parsed view */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-muted/50">
                    <Button
                      variant={!showRawContent ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setShowRawContent(false)}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Structured View
                    </Button>
                    <Button
                      variant={showRawContent ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setShowRawContent(true)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Raw Content
                    </Button>
                  </div>
                </div>

                {!showRawContent ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parseCompanyInfo(result.information).map((section, index) => (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className={`pb-4 ${section.color} rounded-t-lg`}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/20 dark:bg-black/20">
                              {section.icon}
                            </div>
                            <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({children}) => <p className="text-muted-foreground leading-relaxed mb-3 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="list-disc list-inside text-muted-foreground mb-3 space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside text-muted-foreground mb-3 space-y-1">{children}</ol>,
                                li: ({children}) => <li className="text-muted-foreground">{children}</li>,
                                strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                                em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                              }}
                            >
                              {section.content}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-500/10 to-gray-500/5 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-500/20">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">Raw Content</CardTitle>
                          <CardDescription>Unprocessed AI response for debugging</CardDescription>
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
                          {result.information}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Comprehensive Research Results */}
            {result.research_results && (
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
            {result.sections && (
              <div className="space-y-6">
                {/* Summary Stats */}
                {result.summary && (
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/10 to-green-500/5">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{result.summary.total_sections}</div>
                          <div className="text-sm text-muted-foreground">Total Sections</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{result.summary.sections_with_data}</div>
                          <div className="text-sm text-muted-foreground">With Data</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{result.summary.total_sources}</div>
                          <div className="text-sm text-muted-foreground">Sources</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {result.last_updated ? new Date(result.last_updated).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">Last Updated</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Structured Sections */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(result.sections).map(([key, section]) => {
                    if (!section.content || section.content.startsWith("No information")) {
                      return null
                    }

                    const sectionConfig = {
                      company_overview: { title: "Company Overview", icon: <Building2 className="h-5 w-5" />, color: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300" },
                      founders_leadership: { title: "Founders & Leadership", icon: <Users className="h-5 w-5" />, color: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300" },
                      company_history: { title: "Company History", icon: <Calendar className="h-5 w-5" />, color: "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300" },
                      funding_information: { title: "Funding & Investors", icon: <DollarSign className="h-5 w-5" />, color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300" },
                      company_size: { title: "Company Size", icon: <BarChart3 className="h-5 w-5" />, color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300" },
                      demographics: { title: "Demographics", icon: <Globe className="h-5 w-5" />, color: "bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300" },
                      recent_news: { title: "Recent Developments", icon: <TrendingUp className="h-5 w-5" />, color: "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300" },
                      technology_products: { title: "Technology & Products", icon: <Lightbulb className="h-5 w-5" />, color: "bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300" },
                      market_position: { title: "Market Position", icon: <Target className="h-5 w-5" />, color: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300" },
                      culture_values: { title: "Culture & Values", icon: <Heart className="h-5 w-5" />, color: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300" }
                    }

                    const config = sectionConfig[key as keyof typeof sectionConfig] || {
                      title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      icon: <Briefcase className="h-5 w-5" />,
                      color: "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300"
                    }

                    return (
                      <Card key={key} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className={`pb-4 ${config.color} rounded-t-lg`}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/20 dark:bg-black/20">
                              {config.icon}
                            </div>
                            <CardTitle className="text-lg font-semibold">{config.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="prose prose-sm max-w-none mb-4">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({children}) => <p className="text-muted-foreground leading-relaxed mb-3 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="list-disc list-inside text-muted-foreground mb-3 space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside text-muted-foreground mb-3 space-y-1">{children}</ol>,
                                li: ({children}) => <li className="text-muted-foreground">{children}</li>,
                                strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                                em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                              }}
                            >
                              {section.content}
                            </ReactMarkdown>
                          </div>
                          
                          {/* Sources */}
                          {section.sources && section.sources.length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">Sources ({section.sources.length})</span>
                              </div>
                              <div className="space-y-1">
                                {section.sources.slice(0, 3).map((source, index) => (
                                  <a
                                    key={index}
                                    href={source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                                  >
                                    {source}
                                  </a>
                                ))}
                                {section.sources.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{section.sources.length - 3} more sources
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* All Sources */}
                {result.all_sources && result.all_sources.length > 0 && (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-500/10 to-gray-500/5 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-500/20">
                          <ExternalLink className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">All Sources</CardTitle>
                          <CardDescription>Complete list of sources used in this research</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {result.all_sources.map((source, index) => (
                          <a
                            key={index}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                          >
                            <div className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all">
                              {source}
                            </div>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Example Usage */}
        {!result && !loading && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-muted/50 to-muted/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Example Research</CardTitle>
              <CardDescription className="text-lg">
                Try researching these popular companies to see the AI in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "OpenAI", location: "San Francisco", color: "bg-blue-500/10 border-blue-500/20" },
                  { name: "Stripe", location: "San Francisco", color: "bg-green-500/10 border-green-500/20" },
                  { name: "Anthropic", location: "San Francisco", color: "bg-purple-500/10 border-purple-500/20" },
                  { name: "Notion", location: "San Francisco", color: "bg-orange-500/10 border-orange-500/20" }
                ].map((company, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      setCompanyName(company.name)
                      setCompanyLocation(company.location)
                    }}
                    className={`h-auto p-6 flex flex-col items-center gap-3 ${company.color} hover:scale-105 transition-transform`}
                  >
                    <Building2 className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">{company.name}</div>
                      <div className="text-sm text-muted-foreground">{company.location}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 