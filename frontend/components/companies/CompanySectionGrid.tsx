import React from "react"
import { Button } from "../ui/button"
import { Building2, Users, Calendar, DollarSign, BarChart3, Globe, TrendingUp, Lightbulb, Target, Heart, Briefcase, FileText } from "lucide-react"
import { CompanySectionCard } from "./CompanySectionCard"
import { CompanyRawContentCard } from "./CompanyRawContentCard"

interface ParsedSection {
  title: string
  content: string
  icon: React.ReactNode
  color: string
}

interface CompanySectionGridProps {
  information: string
  showRawContent: boolean
  setShowRawContent: (show: boolean) => void
  sections?: {
    [key: string]: {
      content: string
      sources: string[]
    }
  }
  allSources?: string[]
}

export function CompanySectionGrid({ 
  information, 
  showRawContent, 
  setShowRawContent, 
  sections, 
  allSources 
}: CompanySectionGridProps) {
  const parseCompanyInfo = (info: string): ParsedSection[] => {
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

    return parsedSections
  }

  // If we have structured sections, render those
  if (sections) {
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

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sections).map(([key, section]) => {
          if (!section.content || section.content.startsWith("No information")) {
            return null
          }

          const config = sectionConfig[key as keyof typeof sectionConfig] || {
            title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            icon: <Briefcase className="h-5 w-5" />,
            color: "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300"
          }

          return (
            <CompanySectionCard
              key={key}
              title={config.title}
              content={section.content}
              icon={config.icon}
              color={config.color}
              sources={section.sources}
            />
          )
        })}
      </div>
    )
  }

  // If we have information to parse, render parsed sections
  if (information) {
    const parsedSections = parseCompanyInfo(information)
    
    return (
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
            {parsedSections.map((section, index) => (
              <CompanySectionCard
                key={index}
                title={section.title}
                content={section.content}
                icon={section.icon}
                color={section.color}
              />
            ))}
          </div>
        ) : (
          <CompanyRawContentCard content={information} />
        )}
      </div>
    )
  }

  return null
} 