import React from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Building2, MapPin, ExternalLink } from "lucide-react"

interface CompanyHeaderCardProps {
  companyName: string
  companyLocation: string
  researchMethod: string
  searchResultsUsed?: boolean
}

export function CompanyHeaderCard({ companyName, companyLocation, researchMethod, searchResultsUsed }: CompanyHeaderCardProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{companyName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg text-muted-foreground">{companyLocation}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              {researchMethod}
            </Badge>
            {searchResultsUsed && (
              <Badge className="px-4 py-2 text-sm bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                <ExternalLink className="h-3 w-3 mr-1" />
                Web Search
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 