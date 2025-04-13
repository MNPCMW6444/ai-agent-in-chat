"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, Code, Map, Dumbbell, BookOpen, Star, Users } from "lucide-react"
import { useRouter } from "next/navigation"

type Agent = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  usageCount: number
  rating: number
}

type AgentCardProps = {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter()

  const getIcon = () => {
    switch (agent.icon) {
      case "MessageSquare":
        return <MessageSquare className="h-6 w-6 text-primary" />
      case "Heart":
        return <Heart className="h-6 w-6 text-primary" />
      case "Code":
        return <Code className="h-6 w-6 text-primary" />
      case "Map":
        return <Map className="h-6 w-6 text-primary" />
      case "Dumbbell":
        return <Dumbbell className="h-6 w-6 text-primary" />
      case "BookOpen":
        return <BookOpen className="h-6 w-6 text-primary" />
      default:
        return <MessageSquare className="h-6 w-6 text-primary" />
    }
  }

  const handleClick = () => {
    router.push(`/dashboard/chat/${agent.id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">{getIcon()}</div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{agent.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{agent.usageCount.toLocaleString()} users</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleClick}>
          Chat with Agent
        </Button>
      </CardFooter>
    </Card>
  )
}
