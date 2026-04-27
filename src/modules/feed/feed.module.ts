import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FeedProducer } from './producers/feed.producer';
import { FeedConsumer } from './consumers/feed.consumer';
import { FeedWorker } from './consumers/feed.worker';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
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
    FeedConsumer,
    FeedWorker,],
  exports: [FeedProducer],
})
export class FeedModule {}