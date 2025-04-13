"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, ArrowLeft, MessageSquare, Heart, Code, Map, Dumbbell, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

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

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const { agentId } = useParams()
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const agent = agents.find((a) => a.id === agentId) || {
    id: agentId as string,
    name: "AI Agent",
    description: "An AI assistant to help with your tasks",
    icon: "Bot",
    category: "general",
    usageCount: 0,
    rating: 0,
  }

  useEffect(() => {
    // Add welcome message when chat is first opened
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: `Hi there! I'm the ${agent.name}. How can I help you today?`,
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    }
  }, [agent.name, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (agent.id === "agent-1") {
        response =
          "I've analyzed your group chat and here are the key points:\n\n1. Meeting scheduled for Friday at 3 PM\n2. Project deadline extended to next Tuesday\n3. John will prepare the presentation\n4. Sarah needs feedback on the design by tomorrow"
      } else if (agent.id === "agent-2") {
        response =
          "Based on what you've shared, I think open communication would help in this situation. Try expressing your feelings using 'I' statements rather than accusations. Remember that understanding each other's perspective is key to resolving conflicts."
      } else {
        response =
          "Thank you for your message. I'm here to help with any questions or tasks you have. Could you provide more details about what you're looking for?"
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getIcon = () => {
    switch (agent.icon) {
      case "MessageSquare":
        return <MessageSquare className="h-6 w-6" />
      case "Heart":
        return <Heart className="h-6 w-6" />
      case "Code":
        return <Code className="h-6 w-6" />
      case "Map":
        return <Map className="h-6 w-6" />
      case "Dumbbell":
        return <Dumbbell className="h-6 w-6" />
      case "BookOpen":
        return <BookOpen className="h-6 w-6" />
      default:
        return <Bot className="h-6 w-6" />
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <p className="text-xs text-muted-foreground">{agent.description}</p>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3 max-w-[80%]", message.role === "user" ? "ml-auto" : "")}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">{getIcon()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">{getIcon()}</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
