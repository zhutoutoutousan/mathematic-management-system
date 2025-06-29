"use client"

// Mock vector database operations
// In production, you would integrate with a real vector database like Pinecone, Weaviate, or pgvector

export interface VectorEmbedding {
  id: string
  vector: number[]
  metadata: {
    concept_name: string
    category: string
    difficulty: string
    description: string
    tags: string[]
  }
}

export interface SimilarityResult {
  id: string
  score: number
  metadata: VectorEmbedding["metadata"]
}

class VectorDatabase {
  private mockEmbeddings: VectorEmbedding[] = [
    {
      id: "concept_1",
      vector: [0.1, 0.2, 0.3, 0.4, 0.5], // Mock 5D vector
      metadata: {
        concept_name: "Linear Algebra",
        category: "Algebra",
        difficulty: "Advanced",
        description: "Study of linear equations, vector spaces, and linear transformations",
        tags: ["vectors", "matrices", "eigenvalues"],
      },
    },
    {
      id: "concept_2",
      vector: [0.2, 0.1, 0.4, 0.3, 0.6],
      metadata: {
        concept_name: "Calculus Integration",
        category: "Calculus",
        difficulty: "Intermediate",
        description: "Techniques and applications of integral calculus",
        tags: ["integration", "antiderivatives", "area"],
      },
    },
    {
      id: "concept_3",
      vector: [0.3, 0.4, 0.1, 0.5, 0.2],
      metadata: {
        concept_name: "Graph Theory",
        category: "Discrete Math",
        difficulty: "Advanced",
        description: "Mathematical study of graphs and their properties",
        tags: ["graphs", "networks", "algorithms"],
      },
    },
  ]

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding generation - in production use OpenAI, Cohere, etc.
    const words = text.toLowerCase().split(" ")
    const vector = new Array(5).fill(0)

    // Simple mock: hash words to vector positions
    words.forEach((word) => {
      const hash = word.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      vector[hash % 5] += 0.1
    })

    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector
  }

  async addEmbedding(embedding: VectorEmbedding): Promise<void> {
    this.mockEmbeddings.push(embedding)
  }

  async findSimilar(queryVector: number[], topK = 5): Promise<SimilarityResult[]> {
    const similarities = this.mockEmbeddings.map((embedding) => ({
      id: embedding.id,
      score: this.cosineSimilarity(queryVector, embedding.vector),
      metadata: embedding.metadata,
    }))

    return similarities.sort((a, b) => b.score - a.score).slice(0, topK)
  }

  async semanticSearch(query: string, topK = 5): Promise<SimilarityResult[]> {
    const queryVector = await this.generateEmbedding(query)
    return this.findSimilar(queryVector, topK)
  }

  async getRecommendations(conceptId: string, topK = 3): Promise<SimilarityResult[]> {
    const concept = this.mockEmbeddings.find((emb) => emb.id === conceptId)
    if (!concept) return []

    return this.findSimilar(concept.vector, topK + 1)
      .filter((result) => result.id !== conceptId) // Exclude self
      .slice(0, topK)
  }

  async updateEmbedding(id: string, newVector: number[], newMetadata: VectorEmbedding["metadata"]): Promise<boolean> {
    const index = this.mockEmbeddings.findIndex((emb) => emb.id === id)
    if (index !== -1) {
      this.mockEmbeddings[index] = { id, vector: newVector, metadata: newMetadata }
      return true
    }
    return false
  }

  async deleteEmbedding(id: string): Promise<boolean> {
    const index = this.mockEmbeddings.findIndex((emb) => emb.id === id)
    if (index !== -1) {
      this.mockEmbeddings.splice(index, 1)
      return true
    }
    return false
  }
}

export const vectorDB = new VectorDatabase()

// Utility functions for vector operations
export const VectorUtils = {
  async indexConcept(conceptId: string, name: string, description: string, metadata: any): Promise<void> {
    const text = `${name} ${description} ${metadata.tags?.join(" ") || ""}`
    const vector = await vectorDB.generateEmbedding(text)

    await vectorDB.addEmbedding({
      id: conceptId,
      vector,
      metadata: {
        concept_name: name,
        category: metadata.category || "General",
        difficulty: metadata.difficulty || "Intermediate",
        description,
        tags: metadata.tags || [],
      },
    })
  },

  async findRelatedConcepts(conceptName: string, limit = 5): Promise<SimilarityResult[]> {
    return vectorDB.semanticSearch(conceptName, limit)
  },

  async getPersonalizedRecommendations(userProfile: {
    interests: string[]
    difficulty_preference: string
    completed_concepts: string[]
  }): Promise<SimilarityResult[]> {
    const queryText = userProfile.interests.join(" ")
    const results = await vectorDB.semanticSearch(queryText, 10)

    // Filter based on user preferences
    return results
      .filter((result) => !userProfile.completed_concepts.includes(result.id))
      .filter((result) => {
        if (userProfile.difficulty_preference === "beginner") {
          return ["Beginner", "Intermediate"].includes(result.metadata.difficulty)
        }
        if (userProfile.difficulty_preference === "advanced") {
          return ["Intermediate", "Advanced", "Expert"].includes(result.metadata.difficulty)
        }
        return true
      })
      .slice(0, 5)
  },
}
