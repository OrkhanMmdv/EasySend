import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const plans = [
  {
    name: "Sender",
    description: "For people who want to ship items",
    price: "Free",
    period: "to join",
    features: [
      "Post unlimited delivery requests",
      "Browse available travelers",
      "Secure in-app messaging",
      "Escrow payment protection",
      "5% service fee per delivery",
    ],
    cta: "Start Shipping",
    href: "/get-started",
    popular: false,
  },
  {
    name: "Traveler",
    description: "For travelers who want to earn",
    price: "Free",
    period: "to join",
    features: [
      "Post unlimited travel routes",
      "Accept delivery requests",
      "Keep 90% of delivery fees",
      "Flexible pickup & dropoff",
      "Verified traveler badge",
    ],
    cta: "Start Earning",
    href: "/get-started",
    popular: true,
  },
  {
    name: "Business",
    description: "For e-commerce and businesses",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Sender plan",
      "Priority matching with travelers",
      "Bulk shipment management",
      "API access for integration",
      "3% service fee per delivery",
    ],
    cta: "Contact Sales",
    href: "/get-started",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-muted/50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. Join for free and only pay when you ship.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
