"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentCard } from "@/components/agent-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for agents
const agents = [
  {
    id: "agent-1",
    name: "Group Chat Summarizer",
    description: "Summarizes long group chats into key points and action items",
    icon: "MessageSquare",
    category: "productivity",
    usageCount: 1243,
    rating: 4.8,
  },
  {
    id: "agent-2",
    name: "Relationship Advisor",
    description: "Provides thoughtful advice on relationships and communication",
    icon: "Heart",
    category: "personal",
    usageCount: 987,
    rating: 4.6,
  },
  {
    id: "agent-3",
    name: "Code Assistant",
    description: "Helps with coding problems and explains solutions",
    icon: "Code",
    category: "development",
    usageCount: 2156,
    rating: 4.9,
  },
  {
    id: "agent-4",
    name: "Travel Planner",
    description: "Creates personalized travel itineraries based on preferences",
    icon: "Map",
    category: "lifestyle",
    usageCount: 756,
    rating: 4.5,
  },
  {
    id: "agent-5",
    name: "Fitness Coach",
    description: "Provides workout plans and nutrition advice",
    icon: "Dumbbell",
    category: "health",
    usageCount: 1089,
    rating: 4.7,
  },
  {
    id: "agent-6",
    name: "Study Buddy",
    description: "Helps with studying and explains complex topics",
    icon: "BookOpen",
    category: "education",
    usageCount: 1532,
    rating: 4.8,
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === "all" || agent.category === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Discover and use AI agents for various tasks</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            {filteredAgents.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No agents found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
