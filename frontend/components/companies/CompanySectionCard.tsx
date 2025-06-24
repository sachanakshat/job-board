import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { ExternalLink } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CompanySectionCardProps {
  title: string
  content: string
  icon: React.ReactNode
  color: string
  sources?: string[]
}

export function CompanySectionCard({ title, content, icon, color, sources }: CompanySectionCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className={`pb-4 ${color} rounded-t-lg`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 dark:bg-black/20">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
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
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Sources ({sources.length})</span>
            </div>
            <div className="space-y-1">
              {sources.slice(0, 3).map((source, index) => (
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
              {sources.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{sources.length - 3} more sources
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 