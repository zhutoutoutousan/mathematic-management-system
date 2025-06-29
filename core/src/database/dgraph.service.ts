import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgraph from 'dgraph-js';
import { DgraphClient, DgraphClientStub } from 'dgraph-js';

@Injectable()
export class DgraphService implements OnModuleInit, OnModuleDestroy {
  private client: DgraphClient;
  private clientStub: DgraphClientStub;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const endpoint = this.configService.get<string>('DGRAPH_ENDPOINT');
    this.clientStub = new DgraphClientStub(endpoint);
    this.client = new DgraphClient(this.clientStub);
  }

  async onModuleDestroy() {
    this.clientStub.close();
  }

  getClient(): DgraphClient {
    return this.client;
  }

  // Example method for upserting a concept
  async upsertConcept(concept: { id?: string; name: string; description: string }) {
    const txn = this.client.newTxn();
    try {
      const mu = new dgraph.Mutation();
      const query = `query {
        concept(func: eq(name, "${concept.name}")) {
          uid
          name
          description
        }
      }`;

      const resp = await this.client.newTxn().query(query);
      const concepts = resp.getJson().concept;

      if (concepts && concepts.length > 0) {
        // Update existing concept
        mu.setSetJson({
          uid: concepts[0].uid,
          name: concept.name,
          description: concept.description,
        });
      } else {
        // Create new concept
        mu.setSetJson({
          name: concept.name,
          description: concept.description,
          type: 'Concept',
        });
      }

      await txn.mutate(mu);
      await txn.commit();
    } finally {
      await txn.discard();
    }
  }

  // Example method for creating a relationship between concepts
  async createConceptRelationship(
    fromConceptId: string,
    toConceptId: string,
    relationshipType: string,
  ) {
    const txn = this.client.newTxn();
    try {
      const mu = new dgraph.Mutation();
      mu.setSetJson({
        uid: fromConceptId,
        [relationshipType]: {
          uid: toConceptId,
        },
      });

      await txn.mutate(mu);
      await txn.commit();
    } finally {
      await txn.discard();
    }
  }
} 