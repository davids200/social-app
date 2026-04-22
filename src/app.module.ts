import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { LikeModule } from './modules/like/like.module';
import { FollowModule } from './modules/follow/follow.module';
import { Neo4jModule } from './infrastructure/database/neo4j/neo4j.module';

// ✅ Infrastructure worker (IMPORTANT: must be in providers, NOT imports)
import { PostWorker } from './workers/post.worker';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),
      debug: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'social_app',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,
    AuthModule,
    PostModule,
    LikeModule,
    FollowModule,
    Neo4jModule,
  ],

  // ✅ THIS IS THE CRITICAL FIX
  providers: [
    PostWorker,
  ],
})
export class AppModule {}