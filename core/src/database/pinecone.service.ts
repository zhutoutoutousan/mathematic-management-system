import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PineconeClient } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService implements OnModuleInit {
  private client: PineconeClient;

  constructor(private configService: ConfigService) {
    this.client = new PineconeClient();
  }

  async onModuleInit() {
    await this.client.init({
      apiKey: this.configService.get<string>('PINECONE_API_KEY'),
      environment: this.configService.get<string>('PINECONE_ENVIRONMENT'),
    });
  }

  getClient(): PineconeClient {
    return this.client;
  }

  // Example method for upserting vectors
  async upsertVectors(vectors: { id: string; values: number[]; metadata?: any }[]) {
    const index = this.client.Index(this.configService.get<string>('PINECONE_INDEX'));
    await index.upsert({
      upsertRequest: {
        vectors: vectors.map(v => ({
          id: v.id,
          values: v.values,
          metadata: v.metadata,
        })),
      },
    });
  }

  // Example method for querying similar vectors
  async querySimilar(queryVector: number[], topK: number = 10, metadata?: any) {
    const index = this.client.Index(this.configService.get<string>('PINECONE_INDEX'));
    const queryResponse = await index.query({
      queryRequest: {
        vector: queryVector,
        topK,
        includeMetadata: true,
        filter: metadata,
      },
    });
    return queryResponse.matches;
  }
} 