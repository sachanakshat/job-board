import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search, Zap, Brain, BarChart3, Settings } from "lucide-react"

interface CompanyResearchFormProps {
  companyName: string
  setCompanyName: (v: string) => void
  companyLocation: string
  setCompanyLocation: (v: string) => void
  researchType: "quick" | "comprehensive" | "structured"
  setResearchType: (v: "quick" | "comprehensive" | "structured") => void
  llmProvider: string
  setLlmProvider: (v: string) => void
  availableProviders: { llm_providers: string[]; research_types: string[] } | null
  loading: boolean
  showAdvancedOptions: boolean
  setShowAdvancedOptions: (v: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CompanyResearchForm({
  companyName,
  setCompanyName,
  companyLocation,
  setCompanyLocation,
  researchType,
  setResearchType,
  llmProvider,
  setLlmProvider,
  availableProviders,
  loading,
  showAdvancedOptions,
  setShowAdvancedOptions,
  onSubmit
}: CompanyResearchFormProps) {
  return (
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
        <form onSubmit={onSubmit} className="space-y-8">
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
              onValueChange={setResearchType}
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

          {/* Advanced Options */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
            </Button>
            
            {showAdvancedOptions && (
              <div className="p-6 bg-muted/30 rounded-lg">
                <div className="space-y-3">
                  <Label htmlFor="llm-provider" className="text-sm font-semibold">AI Provider</Label>
                  <Select value={llmProvider} onValueChange={setLlmProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProviders?.llm_providers.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    AI provider for search and text processing (with automatic fallback to Playwright)
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-semibold">
            {loading ? (
              <>
                <Search className="mr-3 h-5 w-5 animate-spin" />
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
  )
} 