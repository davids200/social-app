import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
  

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]), // 🔥 THIS FIXES YOUR ERROR 
  ],
  providers: [LikeService, LikeResolver],
  exports: [LikeService, LikeResolver]
})
export class LikeModule {}
