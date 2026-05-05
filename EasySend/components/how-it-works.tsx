import { Search, MessageSquare, Package, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Post or Browse",
    description: "Travelers post their upcoming flights. Senders browse available routes or post delivery requests.",
  },
  {
    icon: MessageSquare,
    title: "Connect & Agree",
    description: "Chat securely through our platform to discuss item details, pickup, and delivery arrangements.",
  },
  {
    icon: Package,
    title: "Hand Off Item",
    description: "Meet at an agreed location before the trip. The traveler carries your item on their journey.",
  },
  {
    icon: CheckCircle,
    title: "Receive & Confirm",
    description: "Item delivered! Confirm receipt in the app. Payment is released to the traveler automatically.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, secure, and straightforward. Get your items delivered in four easy steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-5xl font-bold text-border">0{index + 1}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-7 hidden h-0.5 w-12 bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
