import { Injectable } from '@nestjs/common';
import { InMemoryDbService } from 'src/database/in-memory-db/in-memory-db.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: InMemoryDbService) {}
}
