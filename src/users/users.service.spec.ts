import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { InMemoryDbService } from '../database/in-memory-db.service';
import { NotFoundException } from '@nestjs/common';
import { User, UserRole, UserGroup } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockAdminUser: User = {
  id: 1,
  name: 'Admin User',
  roles: [UserRole.ADMIN],
  groups: [UserGroup.GROUP_1],
};

const mockPersonalUser: User = {
  id: 2,
  name: 'Personal User',
  roles: [UserRole.PERSONAL],
  groups: [UserGroup.GROUP_1],
};

describe('UsersService', () => {
  let service: UsersService;
  let dbService: InMemoryDbService;

  const mockDbService = {
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findAllManagedByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: InMemoryDbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<InMemoryDbService>(InMemoryDbService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const users = [mockAdminUser, mockPersonalUser];
      mockDbService.findAllUsers.mockReturnValue(users);

      expect(service.findAll()).toEqual(users);
      expect(dbService.findAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single user when found', () => {
      mockDbService.findUserById.mockReturnValue(mockAdminUser);

      const result = service.findOne(1);

      expect(result).toEqual(mockAdminUser);
      expect(dbService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if user is not found', () => {
      mockDbService.findUserById.mockReturnValue(undefined);

      expect(() => service.findOne(99)).toThrow(NotFoundException);
      expect(() => service.findOne(99)).toThrow('User with ID #99 not found');
    });
  });

  describe('create', () => {
    it('should successfully create a user', () => {
      const createUserDto: CreateUserDto = {
        name: 'Newbie',
        roles: [UserRole.PERSONAL],
        groups: [UserGroup.GROUP_2],
      };
      const expectedUser = { id: 3, ...createUserDto };

      mockDbService.createUser.mockReturnValue(expectedUser);

      const result = service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(dbService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a found user', () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockAdminUser, ...updateUserDto };

      mockDbService.findUserById.mockReturnValue(mockAdminUser);
      mockDbService.updateUser.mockReturnValue(updatedUser);

      const result = service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(dbService.findUserById).toHaveBeenCalledWith(1);
      expect(dbService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw NotFoundException when trying to update a non-existent user', () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      mockDbService.findUserById.mockReturnValue(undefined);

      expect(() => service.update(99, updateUserDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should call db.deleteUser and not throw if deletion is successful', () => {
      mockDbService.deleteUser.mockReturnValue(true);

      expect(() => service.delete(1)).not.toThrow();
      expect(dbService.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user to delete is not found', () => {
      mockDbService.deleteUser.mockReturnValue(false);

      expect(() => service.delete(99)).toThrow(NotFoundException);
    });
  });

  describe('findAllManagedByUser', () => {
    it('should return an empty array if the manager is not an ADMIN', () => {
      mockDbService.findUserById.mockReturnValue(mockPersonalUser);

      const result = service.findAllManagedByUser(2);

      expect(result).toEqual([]);
      expect(dbService.findAllManagedByUser).not.toHaveBeenCalled();
    });

    it('should call db.findAllManagedByUser if the manager is an ADMIN', () => {
      const managedUsers = [mockPersonalUser];
      mockDbService.findUserById.mockReturnValue(mockAdminUser);
      mockDbService.findAllManagedByUser.mockReturnValue(managedUsers);

      const result = service.findAllManagedByUser(1);

      expect(result).toEqual(managedUsers);
      expect(dbService.findUserById).toHaveBeenCalledWith(1);
      expect(dbService.findAllManagedByUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the manager user does not exist', () => {
      mockDbService.findUserById.mockReturnValue(undefined);

      expect(() => service.findAllManagedByUser(99)).toThrow(NotFoundException);
    });
  });
});
