"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Crown,
  Gamepad2Icon as GameController2,
  Play,
  Plus,
  Search,
  Sword,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function MultiplayerPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const pvpGames = [
    {
      id: 1,
      name: "Algebra Arena",
      description: "Fast-paced algebraic equation solving",
      players: "2/4",
      difficulty: "Hard",
      topic: "Quadratic Equations",
      timeLimit: "5 min",
      status: "waiting",
      host: "MathWizard42",
    },
    {
      id: 2,
      name: "Calculus Clash",
      description: "Integration and differentiation speed challenge",
      players: "3/4",
      difficulty: "Expert",
      topic: "Integration Techniques",
      timeLimit: "10 min",
      status: "starting",
      host: "DerivativeKing",
    },
    {
      id: 3,
      name: "Geometry Gauntlet",
      description: "Prove theorems faster than your opponents",
      players: "1/2",
      difficulty: "Medium",
      topic: "Triangle Properties",
      timeLimit: "15 min",
      status: "waiting",
      host: "ProofMaster",
    },
  ]

  const pveGames = [
    {
      id: 1,
      name: "Linear Algebra Labyrinth",
      description: "Navigate through matrix transformations",
      difficulty: "Advanced",
      topic: "Matrix Operations",
      progress: 65,
      bestScore: 8420,
      attempts: 12,
    },
    {
      id: 2,
      name: "Probability Puzzle Palace",
      description: "Solve probability challenges to unlock doors",
      difficulty: "Intermediate",
      topic: "Conditional Probability",
      progress: 40,
      bestScore: 6750,
      attempts: 8,
    },
    {
      id: 3,
      name: "Number Theory Nexus",
      description: "Discover patterns in prime numbers",
      difficulty: "Expert",
      topic: "Prime Numbers",
      progress: 25,
      bestScore: 4200,
      attempts: 15,
    },
  ]

  const leaderboard = [
    { rank: 1, name: "QuantumSolver", score: 15420, wins: 89, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 2, name: "AlgebraAce", score: 14850, wins: 76, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 3, name: "CalculusChamp", score: 13990, wins: 68, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 4, name: "GeometryGuru", score: 12750, wins: 55, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 5, name: "StatsMaster", score: 11200, wins: 42, avatar: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <GameController2 className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Multiplayer Arena</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Game
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="pvp" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pvp" className="flex items-center gap-2">
                  <Sword className="h-4 w-4" />
                  Player vs Player
                </TabsTrigger>
                <TabsTrigger value="pve" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Player vs Environment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pvp" className="space-y-4">
                {pvpGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sword className="h-5 w-5 text-red-500" />
                            {game.name}
                          </CardTitle>
                          <CardDescription>{game.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={game.status === "starting" ? "default" : "outline"}>{game.status}</Badge>
                          <Badge variant="secondary">{game.difficulty}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                          <div className="text-sm font-medium">{game.players}</div>
                          <div className="text-xs text-gray-500">Players</div>
                        </div>
                        <div className="text-center">
                          <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                          <div className="text-sm font-medium">{game.timeLimit}</div>
                          <div className="text-xs text-gray-500">Time Limit</div>
                        </div>
                        <div className="text-center">
                          <Target className="h-5 w-5 mx-auto mb-1 text-green-500" />
                          <div className="text-sm font-medium">{game.topic}</div>
                          <div className="text-xs text-gray-500">Topic</div>
                        </div>
                        <div className="text-center">
                          <Crown className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                          <div className="text-sm font-medium">{game.host}</div>
                          <div className="text-xs text-gray-500">Host</div>
                        </div>
                      </div>
                      <Button className="w-full" disabled={game.status === "starting"}>
                        <Play className="h-4 w-4 mr-2" />
                        {game.status === "starting" ? "Game Starting..." : "Join Game"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pve" className="space-y-4">
                {pveGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-500" />
                            {game.name}
                          </CardTitle>
                          <CardDescription>{game.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{game.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{game.progress}%</span>
                          </div>
                          <Progress value={game.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">{game.bestScore}</div>
                            <div className="text-xs text-gray-500">Best Score</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{game.attempts}</div>
                            <div className="text-xs text-gray-500">Attempts</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{game.topic}</div>
                            <div className="text-xs text-gray-500">Topic</div>
                          </div>
                        </div>

                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Adventure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Player Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Rank</span>
                    <span className="font-semibold">#42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Score</span>
                    <span className="font-semibold">8,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Wins</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Win Rate</span>
                    <span className="font-semibold">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold">
                        {player.rank}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{player.name}</div>
                        <div className="text-xs text-gray-500">{player.score} pts</div>
                      </div>
                      <div className="text-xs text-gray-500">{player.wins}W</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Game
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
