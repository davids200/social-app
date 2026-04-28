import { Module } from '@nestjs/common';
import { ScyllaSchemaService } from './scylla.schema';

@Module({
  providers: [ScyllaSchemaService],
  exports: [ScyllaSchemaService],
})
export class ScyllaModule {}