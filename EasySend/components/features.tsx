import { Shield, Zap, CreditCard, MessageCircle, Map, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Secure & Verified",
    description: "All users undergo ID verification. Secure escrow payments protect both parties.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Items arrive with travelers on direct flights—often faster than express shipping.",
  },
  {
    icon: CreditCard,
    title: "Save Up to 70%",
    description: "Cut out traditional shipping fees. Pay travelers a fair rate and save significantly.",
  },
  {
    icon: MessageCircle,
    title: "In-App Messaging",
    description: "Communicate directly with travelers through our secure messaging system.",
  },
  {
    icon: Map,
    title: "Real-Time Tracking",
    description: "Track your item&apos;s journey from pickup to delivery with live updates.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Build trust through our community rating system for travelers and senders.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Why Choose CarryConnect
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with trust, security, and convenience at its core. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
