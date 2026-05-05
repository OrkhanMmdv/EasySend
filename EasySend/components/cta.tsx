import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-12 lg:px-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          </div>
          
          <h2 className="mx-auto mb-4 max-w-2xl text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to Transform How You Ship?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-pretty text-lg text-primary-foreground/80">
            Join thousands of users saving money on international deliveries. Get started in minutes.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="gap-2 px-8" asChild>
              <Link href="/get-started">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-transparent px-8 text-primary-foreground hover:bg-white/10" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
