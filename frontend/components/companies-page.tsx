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
  Brain
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
}

export function CompaniesPage() {
  const [companyName, setCompanyName] = useState("")
  const [companyLocation, setCompanyLocation] = useState("")
  const [researchType, setResearchType] = useState<"quick" | "comprehensive">("quick")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompanyResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company Research</h1>
        <p className="text-muted-foreground">
          Get comprehensive information about any company using AI-powered research
        </p>
      </div>

      {/* Research Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Research Company
          </CardTitle>
          <CardDescription>
            Enter company details to get detailed information including founders, funding, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="e.g., OpenAI, Stripe, Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-location">Company Location</Label>
                <Input
                  id="company-location"
                  placeholder="e.g., San Francisco, New York, London"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Research Type</Label>
              <RadioGroup
                value={researchType}
                onValueChange={(value: "quick" | "comprehensive") => setResearchType(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick" id="quick" />
                  <Label htmlFor="quick" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Research
                    <Badge variant="secondary" className="text-xs">Faster, basic info</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <Label htmlFor="comprehensive" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Comprehensive Research
                    <Badge variant="secondary" className="text-xs">Detailed, thorough analysis</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Research Company
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && result.status === "success" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {result.company_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  {result.company_location}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {result.research_method}
                </Badge>
                {result.search_results_used && (
                  <Badge variant="secondary">
                    Web Search
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quick Research Results */}
              {result.information && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold mb-2 text-foreground">{children}</h3>,
                      h4: ({children}) => <h4 className="text-base font-semibold mb-2 text-foreground">{children}</h4>,
                      p: ({children}) => <p className="text-muted-foreground leading-relaxed mb-3">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside text-muted-foreground mb-3 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside text-muted-foreground mb-3 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-muted-foreground">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                      code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">{children}</blockquote>,
                    }}
                  >
                    {result.information}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Comprehensive Research Results */}
              {result.research_results && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Comprehensive Analysis</h3>
                  </div>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold mb-2 text-foreground">{children}</h3>,
                      h4: ({children}) => <h4 className="text-base font-semibold mb-2 text-foreground">{children}</h4>,
                      p: ({children}) => <p className="text-muted-foreground leading-relaxed mb-3">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside text-muted-foreground mb-3 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside text-muted-foreground mb-3 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-muted-foreground">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                      code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">{children}</blockquote>,
                    }}
                  >
                    {result.research_results}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Usage */}
      {!result && !loading && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Example Research</CardTitle>
            <CardDescription>
              Try researching these popular companies to see the AI in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCompanyName("OpenAI")
                  setCompanyLocation("San Francisco")
                }}
                className="justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                OpenAI (San Francisco)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCompanyName("Stripe")
                  setCompanyLocation("San Francisco")
                }}
                className="justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Stripe (San Francisco)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCompanyName("Anthropic")
                  setCompanyLocation("San Francisco")
                }}
                className="justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Anthropic (San Francisco)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCompanyName("Notion")
                  setCompanyLocation("San Francisco")
                }}
                className="justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Notion (San Francisco)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 