import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import {
  UserGroup,
  UserRole,
  User,
  UserRoleDefinition,
} from '../users/entities/user.entity';
import { USERS_SEED } from './data/user.seed';
import { UserFactory } from '../users/factories/user.factory';
import { ROLES_SEED } from './data/role.seed';

@Injectable()
export class InMemoryDbService {
  public readonly groups: UserGroup[] = [UserGroup.GROUP_1, UserGroup.GROUP_2];
  public readonly roleDefinitions: UserRoleDefinition[] = ROLES_SEED;

  public readonly users: User[] = [...USERS_SEED];

  private getNextId(): number {
    const maxId = Math.max(...this.users.map((user) => user.id), 0);
    return maxId + 1;
  }

  findRoleDefinitionByCode(code: UserRole): UserRoleDefinition | undefined {
    return this.roleDefinitions.find((role) => role.code === code);
  }

  findAllUsers(): User[] {
    return this.users;
  }

  findUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findAllManagedByUser(id: number): User[] {
    const manager = this.findUserById(id);
    if (!manager || !manager.roles.includes(UserRole.ADMIN)) {
      return [];
    }

    const managerGroups = new Set(manager.groups);
    return this.users.filter((user) => {
      if (user.id === manager.id) {
        return false;
      }
      return user.groups.some((group) => managerGroups.has(group));
    });
  }

  createUser(createUserDto: CreateUserDto): User {
    const newUser = UserFactory.create(this.getNextId(), createUserDto);

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): User | null {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    const originalUser = this.users[userIndex];
    const updatedUser = { ...originalUser, ...updateUserDto };
    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.users.splice(userIndex, 1);
    return true;
  }
}
