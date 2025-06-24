import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { FileText } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CompanyRawContentCardProps {
  content: string
}

export function CompanyRawContentCard({ content }: CompanyRawContentCardProps) {
  return (
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
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
} 