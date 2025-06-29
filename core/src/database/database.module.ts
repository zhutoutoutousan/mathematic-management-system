import { Global, Module } from '@nestjs/common';
import { DgraphService } from './dgraph.service';
import { PineconeService } from './pinecone.service';

@Global()
@Module({
  providers: [DgraphService, PineconeService],
  exports: [DgraphService, PineconeService],
})
export class DatabaseModule {} 