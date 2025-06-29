"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Brain, FileText, Link2, Plus, Search, Tag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConceptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const concepts = [
    {
      id: 1,
      name: "Linear Algebra",
      description: "Study of linear equations, vector spaces, and linear transformations",
      category: "Algebra",
      difficulty: "Advanced",
      connections: 12,
      problems: 45,
      papers: 8,
      tags: ["vectors", "matrices", "eigenvalues"],
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      name: "Calculus Integration",
      description: "Techniques and applications of integral calculus",
      category: "Calculus",
      difficulty: "Intermediate",
      connections: 8,
      problems: 32,
      papers: 15,
      tags: ["integration", "antiderivatives", "area"],
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      name: "Graph Theory",
      description: "Mathematical study of graphs and their properties",
      category: "Discrete Math",
      difficulty: "Advanced",
      connections: 15,
      problems: 28,
      papers: 12,
      tags: ["graphs", "networks", "algorithms"],
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Probability Theory",
      description: "Mathematical framework for analyzing random phenomena",
      category: "Statistics",
      difficulty: "Intermediate",
      connections: 10,
      problems: 38,
      papers: 20,
      tags: ["probability", "random variables", "distributions"],
      lastUpdated: "5 days ago",
    },
  ]

  const categories = ["all", "Algebra", "Calculus", "Discrete Math", "Statistics", "Geometry", "Analysis"]

  const filteredConcepts = concepts.filter((concept) => {
    const matchesSearch =
      concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || concept.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Mathematical Concepts</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search concepts, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Mathematical Concept</DialogTitle>
                <DialogDescription>
                  Create a new concept and define its relationships in your knowledge graph.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Concept Name</Label>
                  <Input id="name" placeholder="e.g., Fourier Transform" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the concept..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algebra">Algebra</SelectItem>
                        <SelectItem value="calculus">Calculus</SelectItem>
                        <SelectItem value="discrete">Discrete Math</SelectItem>
                        <SelectItem value="statistics">Statistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" placeholder="e.g., transform, frequency, signal processing" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Concept</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {filteredConcepts.map((concept) => (
            <Card key={concept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{concept.name}</CardTitle>
                    <CardDescription className="text-base mb-3">{concept.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {concept.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={concept.difficulty === "Advanced" ? "destructive" : "secondary"}>
                      {concept.difficulty}
                    </Badge>
                    <Badge variant="outline">{concept.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                    <TabsTrigger value="problems">Problems</TabsTrigger>
                    <TabsTrigger value="papers">Papers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Link2 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-blue-600">{concept.connections}</div>
                        <div className="text-sm text-gray-600">Connections</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Brain className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-green-600">{concept.problems}</div>
                        <div className="text-sm text-gray-600">Problems</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold text-purple-600">{concept.papers}</div>
                        <div className="text-sm text-gray-600">Papers</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Last updated: {concept.lastUpdated}</div>
                  </TabsContent>

                  <TabsContent value="connections" className="mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Vector Spaces</span>
                        <Badge variant="outline">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Matrix Operations</span>
                        <Badge variant="outline">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Eigenvalues</span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="problems" className="mt-4">
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Matrix Multiplication Practice</div>
                        <div className="text-sm text-gray-600">Difficulty: Intermediate • Solved: 156 times</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Eigenvalue Computation</div>
                        <div className="text-sm text-gray-600">Difficulty: Advanced • Solved: 89 times</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="papers" className="mt-4">
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Linear Algebra and Its Applications</div>
                        <div className="text-sm text-gray-600">Gilbert Strang • MIT OpenCourseWare</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Matrix Computations</div>
                        <div className="text-sm text-gray-600">Golub & Van Loan • Academic Paper</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No concepts found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or category filter.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Concept
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
