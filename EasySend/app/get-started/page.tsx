"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plane, Eye, EyeOff, ArrowLeft, Check, Package, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

type UserType = "sender" | "traveler" | null

export default function GetStartedPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1 && userType) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    const supabase = createClient()
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: formData.name,
          user_type: userType,
        },
      },
    })
    
    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }
    
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mb-6 text-muted-foreground">
            We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>. 
            Please click the link to verify your account.
          </p>
          <Button asChild>
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link 
            href="/" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">EasySend</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {step === 1 ? "Get started with EasySend" : "Create your account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {step === 1 
                ? "Choose how you want to use the platform" 
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div className={`h-1 flex-1 rounded ${step > 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setUserType("sender")}
                  className={`flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                    userType === "sender" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                    userType === "sender" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">I want to send items</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connect with travelers to ship your packages internationally at lower costs
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Save up to 70%</span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Fast delivery</span>
                    </div>
                  </div>
                  {userType === "sender" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("traveler")}
                  className={`flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                    userType === "traveler" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                    userType === "traveler" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">I want to earn as a traveler</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Earn extra income by carrying items for others on your travels
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Flexible schedule</span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Extra income</span>
                    </div>
                  </div>
                  {userType === "traveler" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>

                <Button type="submit" className="mt-6 w-full" disabled={!userType}>
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create account"}
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden bg-primary lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="relative max-w-md text-center">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative">
            <div className="mb-8 flex justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Package className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Briefcase className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
              Join the Community
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Whether you&apos;re shipping packages or traveling the world, EasySend connects you with opportunities to save money and earn extra income.
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-primary-foreground">50K+</p>
                <p className="text-sm text-primary-foreground/70">Users</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-primary-foreground">120+</p>
                <p className="text-sm text-primary-foreground/70">Countries</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-primary-foreground">$2M+</p>
                <p className="text-sm text-primary-foreground/70">Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
