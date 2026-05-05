"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Plane, 
  Package, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  ChevronRight,
  LogOut,
  User,
  TrendingUp,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

type TabType = "overview" | "trips" | "requests" | "messages"

interface Profile {
  id: string
  email: string
  full_name: string | null
  user_type: string | null
  rating: number
  total_reviews: number
}

interface FlightListing {
  id: string
  departure_city: string
  departure_country: string
  arrival_city: string
  arrival_country: string
  departure_date: string
  arrival_date: string
  available_weight: number
  price_per_kg: number
  status: string
  created_at: string
}

interface DeliveryRequest {
  id: string
  item_description: string
  item_category: string
  weight: number
  from_city: string
  from_country: string
  to_city: string
  to_country: string
  needed_by: string | null
  budget: number | null
  status: string
  created_at: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [flights, setFlights] = useState<FlightListing[]>([])
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showFlightModal, setShowFlightModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
    }

    // Load flights
    const { data: flightsData } = await supabase
      .from("flight_listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (flightsData) {
      setFlights(flightsData)
    }

    // Load requests
    const { data: requestsData } = await supabase
      .from("delivery_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (requestsData) {
      setRequests(requestsData)
    }

    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function createFlight(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase.from("flight_listings").insert({
      user_id: user.id,
      departure_city: formData.get("departure_city") as string,
      departure_country: formData.get("departure_country") as string,
      arrival_city: formData.get("arrival_city") as string,
      arrival_country: formData.get("arrival_country") as string,
      departure_date: formData.get("departure_date") as string,
      arrival_date: formData.get("arrival_date") as string,
      available_weight: parseFloat(formData.get("available_weight") as string),
      price_per_kg: parseFloat(formData.get("price_per_kg") as string),
      description: formData.get("description") as string,
    })

    if (!error) {
      setShowFlightModal(false)
      loadUserData()
    }
  }

  async function createRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase.from("delivery_requests").insert({
      user_id: user.id,
      item_description: formData.get("item_description") as string,
      item_category: formData.get("item_category") as string,
      weight: parseFloat(formData.get("weight") as string),
      from_city: formData.get("from_city") as string,
      from_country: formData.get("from_country") as string,
      to_city: formData.get("to_city") as string,
      to_country: formData.get("to_country") as string,
      needed_by: formData.get("needed_by") as string || null,
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
    })

    if (!error) {
      setShowRequestModal(false)
      loadUserData()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const userName = profile?.full_name || profile?.email?.split("@")[0] || "User"
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EasySend</span>
            </Link>
            
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search trips, requests..." 
                  className="w-64 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "overview" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("trips")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "trips" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Plane className="h-5 w-5" />
                My Trips
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "requests" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Package className="h-5 w-5" />
                My Requests
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "messages" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Messages
              </button>
            </nav>

            <div className="mt-8 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{userName}</p>
                  <p className="text-sm capitalize text-muted-foreground">{profile?.user_type || "User"}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{profile?.rating || 0}</span>
                <span className="text-sm text-muted-foreground">({profile?.total_reviews || 0} reviews)</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Browse Links */}
            <div className="mt-6 space-y-2">
              <Link href="/browse/flights">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plane className="h-4 w-4" />
                  Browse Flights
                </Button>
              </Link>
              <Link href="/browse/requests">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Browse Requests
                </Button>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Welcome Section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {userName.split(" ")[0]}!</h1>
                <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your deliveries</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2" onClick={() => setShowFlightModal(true)}>
                  <Plane className="h-4 w-4" />
                  Post a Trip
                </Button>
                <Button className="gap-2" onClick={() => setShowRequestModal(true)}>
                  <Plus className="h-4 w-4" />
                  New Request
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold text-foreground">$0</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Active Trips</p>
                      <p className="text-2xl font-bold text-foreground">{flights.filter(f => f.status === "active").length}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Open Requests</p>
                      <p className="text-2xl font-bold text-foreground">{requests.filter(r => r.status === "open").length}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Money Saved</p>
                      <p className="text-2xl font-bold text-foreground">$0</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content based on tab */}
            {activeTab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Trips */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
                    <CardTitle className="text-lg">My Trips</CardTitle>
                    <Button variant="ghost" size="sm" className="shrink-0 text-primary" onClick={() => setActiveTab("trips")}>
                      View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {flights.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">No trips yet. Post your first trip!</p>
                    ) : (
                      flights.slice(0, 3).map((flight) => (
                        <div 
                          key={flight.id} 
                          className="flex items-center justify-between gap-3 rounded-lg border border-border p-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Plane className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {flight.departure_city} → {flight.arrival_city}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{new Date(flight.departure_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            flight.status === "active" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {flight.status}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* My Requests */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
                    <CardTitle className="text-lg">My Requests</CardTitle>
                    <Button variant="ghost" size="sm" className="shrink-0 text-primary" onClick={() => setActiveTab("requests")}>
                      View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {requests.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">No requests yet. Create your first request!</p>
                    ) : (
                      requests.slice(0, 3).map((request) => (
                        <div 
                          key={request.id} 
                          className="flex items-center justify-between gap-3 rounded-lg border border-border p-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{request.item_description}</p>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{request.from_city} → {request.to_city}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            request.status === "open" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "trips" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle>My Trips</CardTitle>
                  <Button size="sm" className="gap-2" onClick={() => setShowFlightModal(true)}>
                    <Plus className="h-4 w-4" />
                    New Trip
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {flights.length === 0 ? (
                    <div className="py-8 text-center">
                      <Plane className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No trips posted yet</p>
                      <Button className="mt-4" onClick={() => setShowFlightModal(true)}>Post Your First Trip</Button>
                    </div>
                  ) : (
                    flights.map((flight) => (
                      <div 
                        key={flight.id} 
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Plane className="h-6 w-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {flight.departure_city}, {flight.departure_country} → {flight.arrival_city}, {flight.arrival_country}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(flight.departure_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3.5 w-3.5" />
                                {flight.available_weight}kg available
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                ${flight.price_per_kg}/kg
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`self-start shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:self-center ${
                          flight.status === "active" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {flight.status}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "requests" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle>My Requests</CardTitle>
                  <Button size="sm" className="gap-2" onClick={() => setShowRequestModal(true)}>
                    <Plus className="h-4 w-4" />
                    New Request
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="py-8 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No delivery requests yet</p>
                      <Button className="mt-4" onClick={() => setShowRequestModal(true)}>Create Your First Request</Button>
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div 
                        key={request.id} 
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{request.item_description}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {request.from_city} → {request.to_city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3.5 w-3.5" />
                                {request.weight}kg
                              </span>
                              {request.budget && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  ${request.budget} budget
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`self-start shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:self-center ${
                          request.status === "open" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "messages" && (
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">Messages will appear here when you connect with travelers or senders</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Create Flight Modal */}
      {showFlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Post a Trip</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFlightModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={createFlight} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="departure_city">Departure City</Label>
                  <Input id="departure_city" name="departure_city" placeholder="New York" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure_country">Departure Country</Label>
                  <Input id="departure_country" name="departure_country" placeholder="USA" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="arrival_city">Arrival City</Label>
                  <Input id="arrival_city" name="arrival_city" placeholder="London" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrival_country">Arrival Country</Label>
                  <Input id="arrival_country" name="arrival_country" placeholder="UK" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="departure_date">Departure Date</Label>
                  <Input id="departure_date" name="departure_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrival_date">Arrival Date</Label>
                  <Input id="arrival_date" name="arrival_date" type="date" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="available_weight">Available Weight (kg)</Label>
                  <Input id="available_weight" name="available_weight" type="number" step="0.1" placeholder="5" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_kg">Price per kg ($)</Label>
                  <Input id="price_per_kg" name="price_per_kg" type="number" step="0.01" placeholder="10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input id="description" name="description" placeholder="Additional details about your trip..." />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowFlightModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Post Trip
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Create Delivery Request</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRequestModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={createRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item_description">Item Description</Label>
                <Input id="item_description" name="item_description" placeholder="Electronics, documents, etc." required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item_category">Category</Label>
                  <Input id="item_category" name="item_category" placeholder="Electronics" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.1" placeholder="2" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from_city">From City</Label>
                  <Input id="from_city" name="from_city" placeholder="San Francisco" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from_country">From Country</Label>
                  <Input id="from_country" name="from_country" placeholder="USA" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="to_city">To City</Label>
                  <Input id="to_city" name="to_city" placeholder="Tokyo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to_country">To Country</Label>
                  <Input id="to_country" name="to_country" placeholder="Japan" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="needed_by">Needed By (optional)</Label>
                  <Input id="needed_by" name="needed_by" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget $ (optional)</Label>
                  <Input id="budget" name="budget" type="number" step="0.01" placeholder="50" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
