"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Plane, 
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  MapPin,
  Search,
  Filter,
  User,
  Star,
  X,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

interface FlightListing {
  id: string
  user_id: string
  departure_city: string
  departure_country: string
  arrival_city: string
  arrival_country: string
  departure_date: string
  arrival_date: string
  available_weight: number
  price_per_kg: number
  description: string | null
  status: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string
    rating: number
    total_reviews: number
  }
}

export default function BrowseFlightsPage() {
  const [flights, setFlights] = useState<FlightListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<FlightListing | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [applyMessage, setApplyMessage] = useState("")
  const [applyPrice, setApplyPrice] = useState("")
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    loadFlights()
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }

  async function loadFlights() {
    const supabase = createClient()
    
    const { data } = await supabase
      .from("flight_listings")
      .select(`
        *,
        profiles (
          full_name,
          email,
          rating,
          total_reviews
        )
      `)
      .eq("status", "active")
      .order("departure_date", { ascending: true })

    if (data) {
      setFlights(data as FlightListing[])
    }
    setLoading(false)
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFlight || !currentUserId) return

    setApplying(true)
    const supabase = createClient()

    const { error } = await supabase.from("applications").insert({
      applicant_id: currentUserId,
      flight_listing_id: selectedFlight.id,
      message: applyMessage,
      proposed_price: applyPrice ? parseFloat(applyPrice) : null,
    })

    if (!error) {
      setApplied(true)
      setTimeout(() => {
        setShowApplyModal(false)
        setApplied(false)
        setApplyMessage("")
        setApplyPrice("")
        setSelectedFlight(null)
      }, 2000)
    }
    setApplying(false)
  }

  const filteredFlights = flights.filter(flight => {
    const matchFrom = !searchFrom || 
      flight.departure_city.toLowerCase().includes(searchFrom.toLowerCase()) ||
      flight.departure_country.toLowerCase().includes(searchFrom.toLowerCase())
    const matchTo = !searchTo || 
      flight.arrival_city.toLowerCase().includes(searchTo.toLowerCase()) ||
      flight.arrival_country.toLowerCase().includes(searchTo.toLowerCase())
    return matchFrom && matchTo
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/user" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EasySend</span>
          </Link>
          <div className="w-24" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Available Flights</h1>
          <p className="mt-2 text-muted-foreground">Find travelers heading to your destination and connect with them</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="From (city or country)" 
                  className="pl-10"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="To (city or country)" 
                  className="pl-10"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="py-12 text-center">
            <Plane className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg text-muted-foreground">No flights found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFlights.map((flight) => {
              const travelerName = flight.profiles?.full_name || flight.profiles?.email?.split("@")[0] || "Traveler"
              const initials = travelerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
              const isOwnListing = currentUserId === flight.user_id

              return (
                <Card key={flight.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Flight Info */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Plane className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {flight.departure_city}, {flight.departure_country}
                                </h3>
                                <p className="text-muted-foreground">to {flight.arrival_city}, {flight.arrival_country}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${flight.price_per_kg}</p>
                            <p className="text-sm text-muted-foreground">per kg</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(flight.departure_date).toLocaleDateString()} - {new Date(flight.arrival_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Package className="h-4 w-4" />
                            {flight.available_weight}kg available
                          </span>
                        </div>

                        {flight.description && (
                          <p className="mt-3 text-sm text-muted-foreground">{flight.description}</p>
                        )}
                      </div>

                      {/* Traveler Info & Action */}
                      <div className="border-t border-border bg-muted/30 p-6 lg:w-72 lg:border-l lg:border-t-0">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{travelerName}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span>{flight.profiles?.rating || 0}</span>
                              <span>({flight.profiles?.total_reviews || 0})</span>
                            </div>
                          </div>
                        </div>

                        {isOwnListing ? (
                          <p className="mt-4 text-center text-sm text-muted-foreground">This is your listing</p>
                        ) : currentUserId ? (
                          <Button 
                            className="mt-4 w-full gap-2" 
                            onClick={() => {
                              setSelectedFlight(flight)
                              setShowApplyModal(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Contact Traveler
                          </Button>
                        ) : (
                          <Button asChild className="mt-4 w-full">
                            <Link href="/login">Login to Apply</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Contact Traveler</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowApplyModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {applied ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground">Application Sent!</p>
                <p className="text-sm text-muted-foreground">The traveler will be notified</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-medium text-foreground">
                    {selectedFlight.departure_city} → {selectedFlight.arrival_city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedFlight.departure_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message"
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe what you need delivered..."
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Your Offer ($ - optional)</Label>
                  <Input 
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="50"
                    value={applyPrice}
                    onChange={(e) => setApplyPrice(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={applying}>
                    {applying ? "Sending..." : "Send Application"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
