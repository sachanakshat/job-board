import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { ExternalLink } from "lucide-react"

interface CompanySourcesCardProps {
  sources: string[]
}

export function CompanySourcesCard({ sources }: CompanySourcesCardProps) {
  return (
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
          {sources.map((source, index) => (
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
  )
} 