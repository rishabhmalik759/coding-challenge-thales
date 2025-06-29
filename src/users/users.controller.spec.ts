import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole, UserGroup, User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CanActivate } from '@nestjs/common';

const mockPermissionsGuard: CanActivate = {
  canActivate: jest.fn(() => true),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    roles: [UserRole.ADMIN],
    groups: [UserGroup.GROUP_1],
  };

  const mockUsersArray: User[] = [mockUser];

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllManagedByUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(PermissionsGuard)
      .useValue(mockPermissionsGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct DTO and return the result', () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        roles: [UserRole.PERSONAL],
        groups: [UserGroup.GROUP_1],
      };

      jest.spyOn(service, 'create').mockReturnValue(mockUser);

      const result = controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll and return the result', () => {
      jest.spyOn(service, 'findAll').mockReturnValue(mockUsersArray);

      const result = controller.findAll();

      expect(result).toEqual(mockUsersArray);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllManagedByUser', () => {
    it('should call usersService.findAllManagedByUser with the correct id and return the result', () => {
      const userId = 1;
      jest
        .spyOn(service, 'findAllManagedByUser')
        .mockReturnValue(mockUsersArray);

      const result = controller.findAllManagedByUser(userId);

      expect(result).toEqual(mockUsersArray);
      expect(service.findAllManagedByUser).toHaveBeenCalledWith(userId);
      expect(service.findAllManagedByUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call usersService.update with the correct id and DTO and return the result', () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      jest.spyOn(service, 'update').mockReturnValue(mockUser);

      const result = controller.update(userId, updateUserDto);

      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should call usersService.delete with the correct id', () => {
      const userId = 1;
      // .mockReturnValue(undefined) is a good practice for methods that return void.
      jest.spyOn(service, 'delete').mockReturnValue(undefined);

      controller.delete(userId);

      expect(service.delete).toHaveBeenCalledWith(userId);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
