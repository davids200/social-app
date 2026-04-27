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
import { NotificationModule } from './modules/notification/notification.module';
import { BullModule } from '@nestjs/bullmq';


// ✅ Infrastructure worker (IMPORTANT: must be in providers, NOT imports) 
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module'; 
import { NotificationGateway } from './modules/notification/notification.gateway';
import { FeedModule } from './modules/feed/feed.module';
import { ScyllaModule } from './infrastructure/database/scylladb/scylla.module';



@Module({
  imports: [
     BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
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
    FeedModule, 
    NotificationModule,
    NotificationGateway,
     EventEmitterModule.forRoot(),
     ScyllaModule,
  ],

  // ✅ THIS IS THE CRITICAL FIX
  providers: [ 
  ],
  
})
export class AppModule {}