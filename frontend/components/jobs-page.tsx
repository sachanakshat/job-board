"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"
import { ExternalLink, MapPin, Building2, Calendar, Users, Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface Job {
  position: string
  company: string
  location: string
  salary: string
  tags: string[]
  posted: string
  job_url: string
  views: string
  applicants: string
  apply_percentage: string
  parsed_description: {
    jobTitle: string
    description?: string
    jobDescription?: string
    requirements?: {
      skills?: string[]
      technicalSkills?: string[]
    }
    compensation?: {
      salary?: {
        estimated?: string
        range?: string
      }
    }
  }
}

interface PaginationInfo {
  total: number
  limit: number
  skip: number
  has_more: boolean
}

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 50,
    skip: 0,
    has_more: false
  })

  const fetchJobs = async (skip: number = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/api/jobs?skip=${skip}&limit=${pagination.limit}`)
      const data = await response.json()
      
      if (data.status === 'success') {
        setJobs(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handlePreviousPage = () => {
    if (pagination.skip > 0) {
      const newSkip = Math.max(0, pagination.skip - pagination.limit)
      fetchJobs(newSkip)
    }
  }

  const handleNextPage = () => {
    if (pagination.has_more) {
      const newSkip = pagination.skip + pagination.limit
      fetchJobs(newSkip)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
        <p className="text-muted-foreground">Find your next opportunity from our curated list of remote jobs</p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.job_url} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{job.position}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {job.company}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {job.apply_percentage} apply rate
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(job.posted).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.applicants} applicants
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {job.views}
                  </div>
                </div>

                {(job.parsed_description?.description || job.parsed_description?.jobDescription) && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.parsed_description.description || job.parsed_description.jobDescription}
                  </p>
                )}

                {(job.parsed_description?.requirements?.skills || job.parsed_description?.requirements?.technicalSkills) && (
                  <div className="flex flex-wrap gap-2">
                    {(job.parsed_description.requirements.skills || job.parsed_description.requirements.technicalSkills || [])
                      .slice(0, 5)
                      .map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                    ))}
                    {(job.parsed_description.requirements.skills || job.parsed_description.requirements.technicalSkills || []).length > 5 && (
                      <Badge variant="outline">
                        +{(job.parsed_description.requirements.skills || job.parsed_description.requirements.technicalSkills || []).length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-between items-center py-4">
              <div className="text-sm text-muted-foreground">
                {job.parsed_description?.compensation?.salary?.estimated || 
                 job.parsed_description?.compensation?.salary?.range || 
                 'Salary not specified'}
              </div>
              <Button asChild>
                <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={pagination.skip === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {Math.floor(pagination.skip / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={!pagination.has_more}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 