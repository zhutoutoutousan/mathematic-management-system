"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Brain, Maximize2, Minimize2, Search, Settings, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState([50])
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock graph data
  const nodes = [
    { id: 1, name: "Linear Algebra", x: 300, y: 200, category: "Algebra", connections: 12, color: "#3b82f6" },
    { id: 2, name: "Calculus", x: 500, y: 150, category: "Calculus", connections: 15, color: "#10b981" },
    { id: 3, name: "Graph Theory", x: 400, y: 300, category: "Discrete", connections: 8, color: "#f59e0b" },
    { id: 4, name: "Probability", x: 200, y: 350, category: "Statistics", connections: 10, color: "#ef4444" },
    { id: 5, name: "Topology", x: 600, y: 250, category: "Analysis", connections: 6, color: "#8b5cf6" },
    { id: 6, name: "Number Theory", x: 350, y: 100, category: "Algebra", connections: 7, color: "#06b6d4" },
  ]

  const edges = [
    { from: 1, to: 2, strength: 0.8 },
    { from: 1, to: 3, strength: 0.6 },
    { from: 2, to: 5, strength: 0.7 },
    { from: 3, to: 4, strength: 0.5 },
    { from: 4, to: 2, strength: 0.4 },
    { from: 5, to: 6, strength: 0.6 },
    { from: 1, to: 6, strength: 0.3 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = `rgba(156, 163, 175, ${edge.strength})`
        ctx.lineWidth = edge.strength * 3
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20 + node.connections * 2, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.name, node.x, node.y + 40)
    })

    // Handle click events
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedNode = nodes.find((node) => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        return distance <= 20 + node.connections * 2
      })

      setSelectedNode(clickedNode || null)
    }

    canvas.addEventListener("click", handleClick)
    return () => canvas.removeEventListener("click", handleClick)
  }, [zoomLevel])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                <Brain className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Knowledge Graph</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Graph Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Concepts</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search nodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Zoom Level</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <ZoomOut className="h-4 w-4" />
                    <Slider
                      value={zoomLevel}
                      onValueChange={setZoomLevel}
                      max={100}
                      min={10}
                      step={10}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <Label>Filter by Category</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="algebra">Algebra</SelectItem>
                      <SelectItem value="calculus">Calculus</SelectItem>
                      <SelectItem value="discrete">Discrete Math</SelectItem>
                      <SelectItem value="statistics">Statistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Node Details */}
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedNode.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {selectedNode.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Connections:</strong> {selectedNode.connections}
                      </p>
                      <p>
                        <strong>Position:</strong> ({selectedNode.x}, {selectedNode.y})
                      </p>
                    </div>
                    <Button size="sm" className="w-full">
                      View Concept Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Graph Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Graph Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <span className="font-semibold">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Edges:</span>
                    <span className="font-semibold">{edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Connections:</span>
                    <span className="font-semibold">
                      {(nodes.reduce((sum, node) => sum + node.connections, 0) / nodes.length).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graph Density:</span>
                    <span className="font-semibold">0.47</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Interactive Knowledge Graph</CardTitle>
                <CardDescription>Click on nodes to explore connections between mathematical concepts</CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0">
                <canvas ref={canvasRef} className="w-full h-full cursor-pointer" style={{ height: "500px" }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Algebra</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Calculus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Discrete Math</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm">Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                <span className="text-sm">Number Theory</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
