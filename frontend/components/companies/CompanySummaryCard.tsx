import React from "react"
import { Card, CardContent } from "../ui/card"

interface CompanySummaryCardProps {
  summary: {
    total_sections: number
    sections_with_data: number
    total_sources: number
  }
  lastUpdated?: string
}

export function CompanySummaryCard({ summary, lastUpdated }: CompanySummaryCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/10 to-green-500/5">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{summary.total_sections}</div>
            <div className="text-sm text-muted-foreground">Total Sections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{summary.sections_with_data}</div>
            <div className="text-sm text-muted-foreground">With Data</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{summary.total_sources}</div>
            <div className="text-sm text-muted-foreground">Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 