import { Global, Module } from '@nestjs/common';
import { InMemoryDbService } from './in-memory-db/in-memory-db.service';

@Global()
@Module({
  providers: [InMemoryDbService],
  exports: [InMemoryDbService],
})
export class DatabaseModule {}
