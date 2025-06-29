import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserFactory {
  public static create(id: number, dto: CreateUserDto): User {
    const newUser: User = {
      id: id,
      name: dto.name,
      roles: dto.roles,
      groups: dto.groups,
    };
    return newUser;
  }
}
