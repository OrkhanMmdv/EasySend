"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Package, 
  Plane,
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  User,
  Star,
  X,
  MessageSquare,
  Weight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

interface DeliveryRequest {
  id: string
  user_id: string
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
  profiles: {
    full_name: string | null
    email: string
    rating: number
    total_reviews: number
  }
}

export default function BrowseRequestsPage() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [applyMessage, setApplyMessage] = useState("")
  const [applyPrice, setApplyPrice] = useState("")
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    loadRequests()
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }

  async function loadRequests() {
    const supabase = createClient()
    
    const { data } = await supabase
      .from("delivery_requests")
      .select(`
        *,
        profiles (
          full_name,
          email,
          rating,
          total_reviews
        )
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false })

    if (data) {
      setRequests(data as DeliveryRequest[])
    }
    setLoading(false)
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRequest || !currentUserId) return

    setApplying(true)
    const supabase = createClient()

    const { error } = await supabase.from("applications").insert({
      applicant_id: currentUserId,
      delivery_request_id: selectedRequest.id,
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
        setSelectedRequest(null)
      }, 2000)
    }
    setApplying(false)
  }

  const filteredRequests = requests.filter(request => {
    const matchFrom = !searchFrom || 
      request.from_city.toLowerCase().includes(searchFrom.toLowerCase()) ||
      request.from_country.toLowerCase().includes(searchFrom.toLowerCase())
    const matchTo = !searchTo || 
      request.to_city.toLowerCase().includes(searchTo.toLowerCase()) ||
      request.to_country.toLowerCase().includes(searchTo.toLowerCase())
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
          <h1 className="text-3xl font-bold text-foreground">Browse Delivery Requests</h1>
          <p className="mt-2 text-muted-foreground">Find items to deliver on your next trip and earn money</p>
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
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg text-muted-foreground">No delivery requests found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => {
              const senderName = request.profiles?.full_name || request.profiles?.email?.split("@")[0] || "Sender"
              const initials = senderName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
              const isOwnListing = currentUserId === request.user_id

              return (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Request Info */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{request.item_description}</h3>
                                <p className="text-muted-foreground">{request.item_category}</p>
                              </div>
                            </div>
                          </div>
                          {request.budget && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">${request.budget}</p>
                              <p className="text-sm text-muted-foreground">budget</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {request.from_city}, {request.from_country} → {request.to_city}, {request.to_country}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Package className="h-4 w-4" />
                            {request.weight}kg
                          </span>
                          {request.needed_by && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              Needed by {new Date(request.needed_by).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sender Info & Action */}
                      <div className="border-t border-border bg-muted/30 p-6 lg:w-72 lg:border-l lg:border-t-0">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{senderName}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span>{request.profiles?.rating || 0}</span>
                              <span>({request.profiles?.total_reviews || 0})</span>
                            </div>
                          </div>
                        </div>

                        {isOwnListing ? (
                          <p className="mt-4 text-center text-sm text-muted-foreground">This is your request</p>
                        ) : currentUserId ? (
                          <Button 
                            className="mt-4 w-full gap-2" 
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowApplyModal(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Offer to Deliver
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
      {showApplyModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Offer to Deliver</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowApplyModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {applied ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground">Offer Sent!</p>
                <p className="text-sm text-muted-foreground">The sender will be notified</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-medium text-foreground">{selectedRequest.item_description}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.from_city} → {selectedRequest.to_city}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message"
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tell the sender about your travel plans..."
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Your Price ($ - optional)</Label>
                  <Input 
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder={selectedRequest.budget ? String(selectedRequest.budget) : "50"}
                    value={applyPrice}
                    onChange={(e) => setApplyPrice(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={applying}>
                    {applying ? "Sending..." : "Send Offer"}
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
