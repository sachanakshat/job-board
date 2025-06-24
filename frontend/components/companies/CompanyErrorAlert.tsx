import React from "react"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"

export function CompanyErrorAlert({ error }: { error: string }) {
  return (
    <Alert className="mb-8 border-destructive/50 bg-destructive/10">
      <AlertCircle className="h-5 w-5 text-destructive" />
      <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
    </Alert>
  )
} 