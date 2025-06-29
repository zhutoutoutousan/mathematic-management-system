"use client"

import { useState } from "react"
import { BookOpen, Brain, Gamepad2Icon as GameController2, Network, Plus, Search, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const recentConcepts = [
    {
      id: 1,
      name: "Linear Algebra",
      category: "Algebra",
      connections: 12,
      problems: 45,
      papers: 8,
      difficulty: "Advanced",
    },
    {
      id: 2,
      name: "Calculus Integration",
      category: "Calculus",
      connections: 8,
      problems: 32,
      papers: 15,
      difficulty: "Intermediate",
    },
    {
      id: 3,
      name: "Graph Theory",
      category: "Discrete Math",
      connections: 15,
      problems: 28,
      papers: 12,
      difficulty: "Advanced",
    },
  ]

  const activeGames = [
    {
      id: 1,
      name: "Algebra Arena",
      type: "PVP",
      players: "2/4",
      difficulty: "Hard",
      topic: "Quadratic Equations",
    },
    {
      id: 2,
      name: "Calculus Challenge",
      type: "PVE",
      players: "1/1",
      difficulty: "Expert",
      topic: "Integration Techniques",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">MathGraph</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/concepts" className="text-gray-600 hover:text-indigo-600 font-medium">
                Concepts
              </Link>
              <Link href="/graph" className="text-gray-600 hover:text-indigo-600 font-medium">
                Knowledge Graph
              </Link>
              <Link href="/problems" className="text-gray-600 hover:text-indigo-600 font-medium">
                Problems
              </Link>
              <Link href="/multiplayer" className="text-gray-600 hover:text-indigo-600 font-medium">
                Multiplayer
              </Link>
            </nav>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Concept
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mathematics Knowledge Hub</h2>
          <p className="text-gray-600 mb-6">
            Organize, connect, and master mathematical concepts through interactive learning and competitive gaming.
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search concepts, problems, or papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Concepts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graph Connections</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,429</div>
              <p className="text-xs text-muted-foreground">+89 new connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,847</div>
              <p className="text-xs text-muted-foreground">+156 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+23 online now</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="concepts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="concepts">Recent Concepts</TabsTrigger>
            <TabsTrigger value="games">Active Games</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="concepts" className="space-y-4">
            <div className="grid gap-4">
              {recentConcepts.map((concept) => (
                <Card key={concept.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{concept.name}</CardTitle>
                        <CardDescription>{concept.category}</CardDescription>
                      </div>
                      <Badge variant={concept.difficulty === "Advanced" ? "destructive" : "secondary"}>
                        {concept.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Network className="h-4 w-4" />
                        {concept.connections} connections
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        {concept.problems} problems
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {concept.papers} papers
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="grid gap-4">
              {activeGames.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <GameController2 className="h-5 w-5" />
                          {game.name}
                        </CardTitle>
                        <CardDescription>{game.topic}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={game.type === "PVP" ? "default" : "outline"}>{game.type}</Badge>
                        <Badge variant="secondary">{game.difficulty}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Players: {game.players}</span>
                      <Button size="sm">Join Game</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Learning Path</CardTitle>
                <CardDescription>Based on your progress and vector similarity analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Differential Equations</p>
                      <p className="text-sm text-gray-600">92% match with your current knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Complex Analysis</p>
                      <p className="text-sm text-gray-600">87% match with your interests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Topology Fundamentals</p>
                      <p className="text-sm text-gray-600">Challenge level: Perfect fit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
