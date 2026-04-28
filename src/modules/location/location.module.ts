import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { RedisModule } from 'src/infrastructure/redis/redis.module';



@Module({
  imports: [TypeOrmModule.forFeature([Location]),
RedisModule],
  providers: [LocationService, LocationResolver],
  exports: [LocationService],
})
export class LocationModule {}