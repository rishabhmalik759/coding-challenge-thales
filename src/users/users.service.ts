import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDbService } from 'src/database/in-memory-db/in-memory-db.service';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): User[] {
    return this.db.findAllUsers();
  }

  findOne(id: number): User {
    const user = this.db.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    return this.db.createUser(createUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    this.findOne(id);

    const updatedUser = this.db.updateUser(id, updateUserDto);
    return updatedUser!;
  }

  delete(id: number): void {
    const wasDeleted = this.db.deleteUser(id);
    if (!wasDeleted) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
  }

  findAllManagedByUser(id: number): User[] {
    const manager = this.findOne(id);

    if (!manager.roles.includes(UserRole.ADMIN)) {
      return [];
    }

    return this.db.findAllManagedByUser(id);
  }
}
