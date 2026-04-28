import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FeedProducer } from './producers/feed.producer';
import { FeedConsumer } from './consumers/feed.consumer';
import { FeedWorker } from './consumers/feed.worker';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { Post } from '../post/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/infrastructure/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    KafkaModule,
     TypeOrmModule.forFeature([Post]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'social-app',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'feed-consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [ FeedProducer,
    FeedConsumer,FeedResolver,FeedService,
    FeedWorker,],
  exports: [FeedProducer,FeedService],
})
export class FeedModule {}