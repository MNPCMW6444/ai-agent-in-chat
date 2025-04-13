import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, MessageSquare, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AgentHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#use-cases" className="text-sm font-medium hover:underline underline-offset-4">
              Use Cases
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background to-background/80">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your Personal AI Agents <br />
              <span className="text-primary">For Every Task</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover a new way to interact with AI. Our platform offers specialized agents for various tasks, from
              summarizing group chats to providing relationship advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/agents">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Agents <Bot className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative mx-auto max-w-5xl rounded-xl border bg-background shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-medium text-primary-foreground rounded-full">
                Dashboard Preview
              </div>
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="Dashboard Preview"
                width={1200}
                height={600}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialized Agents</h3>
                <p className="text-muted-foreground">
                  Access a variety of AI agents designed for specific tasks and domains, each with unique capabilities.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intuitive Chat</h3>
                <p className="text-muted-foreground">
                  Engage with agents through a natural, conversational interface that understands context and intent.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                <p className="text-muted-foreground">
                  Agents learn from your interactions to provide increasingly relevant and personalized assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-background rounded-xl border">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Group Chat Summarizer</h3>
                  <p className="text-muted-foreground mb-4">
                    Never miss important information in busy group chats. Our summarizer agent condenses long
                    conversations into key points and action items.
                  </p>
                  <Link href="/agents/summarizer">
                    <Button variant="outline" size="sm" className="gap-2">
                      Try Summarizer <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-background rounded-xl border">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Relationship Advisor</h3>
                  <p className="text-muted-foreground mb-4">
                    Get thoughtful advice on relationships, communication strategies, and conflict resolution from our
                    specialized relationship agent.
                  </p>
                  <Link href="/agents/relationship-advisor">
                    <Button variant="outline" size="sm" className="gap-2">
                      Try Advisor <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of AI?</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/80">
              Join thousands of users who are already enhancing their productivity and decision-making with our AI
              agents.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">AgentHub</span>
            </div>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgentHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
