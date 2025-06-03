"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">JobScanner</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
                Find Jobs
              </Link>
              <Link href="/companies" className="text-sm font-medium transition-colors hover:text-primary">
                Companies
              </Link>
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
                    Find Jobs
                  </Link>
                  <Link href="/companies" className="text-sm font-medium transition-colors hover:text-primary">
                    Companies
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                    Pricing
                  </Link>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 