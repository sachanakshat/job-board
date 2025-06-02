import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Sparkles } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              The Future of Job Search
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect Match in the Job Market
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Connecting talented professionals with their dream opportunities, all in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button size="lg" className="text-lg">
                    Find Jobs
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">One-Click Apply</h4>
                      <p className="text-sm">Apply to multiple jobs with a single click</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Button size="lg" variant="outline" className="text-lg">
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Value Proposition Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Job Seekers</CardTitle>
                <CardDescription>Find your dream job</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find the perfect opportunity that matches your skills and aspirations. One-click apply to multiple job boards.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Companies</CardTitle>
                <CardDescription>Hire the best talent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with the right talent efficiently. Post once, reach candidates across multiple platforms.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Recruiters</CardTitle>
                <CardDescription>Streamline your process</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streamline your hiring process with our comprehensive application tracking system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Job Scanner?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">New</Badge>
                  Unified Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No more juggling between multiple job boards. Everything you need is right here.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our intelligent system helps match the right candidates with the right opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>One-Click Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apply to multiple jobs with a single click, saving you time and effort.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Application Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Keep track of all your applications and hiring processes in one place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 text-center">
          <Alert className="mb-8 bg-primary-foreground/10 border-primary-foreground/20">
            <AlertTitle>Limited Time Offer!</AlertTitle>
            <AlertDescription>
              Get 3 months of premium features free when you sign up today.
            </AlertDescription>
          </Alert>
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using Job Scanner
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
} 