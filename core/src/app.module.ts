import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConceptsModule } from './concepts/concepts.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ConceptsModule,
    CompetitionsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
