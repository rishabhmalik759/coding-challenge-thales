import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryDbService } from './in-memory-db.service';
import { USERS_SEED } from './data/user.seed';
import { UserRole, UserGroup } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('InMemoryDbService', () => {
  let service: InMemoryDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryDbService],
    }).compile();

    service = module.get<InMemoryDbService>(InMemoryDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with the correct seed data', () => {
    expect(service.users.length).toBe(USERS_SEED.length);
    expect(service.users[0].name).toBe('John Doe');
  });

  describe('findUserById', () => {
    it('should return a user when a valid ID is provided', () => {
      const user = service.findUserById(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
    });

    it('should return undefined for a non-existent ID', () => {
      const user = service.findUserById(999);
      expect(user).toBeUndefined();
    });
  });

  describe('findRoleDefinitionByCode', () => {
    it('should return the correct role definition', () => {
      const roleDef = service.findRoleDefinitionByCode(UserRole.ADMIN);
      expect(roleDef).toBeDefined();
      expect(roleDef.name).toBe('Admin');
      expect(roleDef.permissions).toContain('CREATE');
    });

    it('should return undefined for a role not in the seed', () => {
      const nonExistentRole = 'GHOST_ROLE' as UserRole;
      const roleDef = service.findRoleDefinitionByCode(nonExistentRole);
      expect(roleDef).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should add a new user to the users array and return it', () => {
      const initialUserCount = service.users.length;
      const createUserDto: CreateUserDto = {
        name: 'New User',
        roles: [UserRole.VIEWER],
        groups: [UserGroup.GROUP_2],
      };

      const newUser = service.createUser(createUserDto);

      expect(newUser).toBeDefined();
      expect(newUser.name).toBe(createUserDto.name);
      expect(newUser.id).toBe(USERS_SEED.length + 1);
      expect(service.users.length).toBe(initialUserCount + 1);
      expect(service.findUserById(newUser.id)).toEqual(newUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user and return the updated user', () => {
      const userId = 2;
      const updateDto = { name: 'Gabriel Monroe Updated' };
      const originalUser = service.findUserById(userId);

      const updatedUser = service.updateUser(userId, updateDto);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser.id).toBe(userId);
      expect(updatedUser.name).toBe('Gabriel Monroe Updated');
      expect(updatedUser.roles).toEqual(originalUser.roles);
    });

    it('should return null if the user to update does not exist', () => {
      const result = service.updateUser(999, { name: 'Ghost' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should remove a user from the array and return true', () => {
      const userId = 3;
      const initialUserCount = service.users.length;

      const result = service.deleteUser(userId);

      expect(result).toBe(true);
      expect(service.users.length).toBe(initialUserCount - 1);
      expect(service.findUserById(userId)).toBeUndefined();
    });

    it('should return false if the user to delete does not exist', () => {
      const initialUserCount = service.users.length;
      const result = service.deleteUser(999);

      expect(result).toBe(false);
      expect(service.users.length).toBe(initialUserCount);
    });
  });

  describe('findAllManagedByUser', () => {
    it('should return users in the same groups for an ADMIN manager', () => {
      const managerId = 1;
      const managedUsers = service.findAllManagedByUser(managerId);

      expect(managedUsers.length).toBe(5);
      expect(managedUsers.find((u) => u.id === managerId)).toBeUndefined();
      expect(managedUsers.find((u) => u.id === 2)).toBeDefined();
    });

    it('should return an empty array for a non-ADMIN manager', () => {
      const managerId = 3;
      const managedUsers = service.findAllManagedByUser(managerId);
      expect(managedUsers).toEqual([]);
    });

    it('should return an empty array for a non-existent manager ID', () => {
      const managedUsers = service.findAllManagedByUser(999);
      expect(managedUsers).toEqual([]);
    });
  });
});
