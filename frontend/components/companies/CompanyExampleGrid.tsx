import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Award, Building2 } from "lucide-react"

interface CompanyExampleGridProps {
  setCompanyName: (v: string) => void
  setCompanyLocation: (v: string) => void
}

export function CompanyExampleGrid({ setCompanyName, setCompanyLocation }: CompanyExampleGridProps) {
  const companies = [
    { name: "OpenAI", location: "San Francisco", color: "bg-blue-500/10 border-blue-500/20" },
    { name: "Stripe", location: "San Francisco", color: "bg-green-500/10 border-green-500/20" },
    { name: "Anthropic", location: "San Francisco", color: "bg-purple-500/10 border-purple-500/20" },
    { name: "Notion", location: "San Francisco", color: "bg-orange-500/10 border-orange-500/20" }
  ]
  return (
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
          {companies.map((company, index) => (
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
  )
} 