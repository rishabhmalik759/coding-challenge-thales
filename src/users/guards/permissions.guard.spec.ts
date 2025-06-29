import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { InMemoryDbService } from '../../database/in-memory-db.service';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import {
  UserPermission,
  UserRole,
  UserGroup,
  User,
  UserRoleDefinition,
} from '../entities/user.entity';

const mockAdminUser: User = {
  id: 1,
  name: 'Admin User',
  roles: [UserRole.ADMIN],
  groups: [UserGroup.GROUP_1],
};

const mockViewerUser: User = {
  id: 6,
  name: 'Viewer User',
  roles: [UserRole.VIEWER],
  groups: [UserGroup.GROUP_1],
};

const mockAdminRoleDefinition: UserRoleDefinition = {
  name: 'Admin',
  code: UserRole.ADMIN,
  permissions: [UserPermission.CREATE, UserPermission.VIEW],
};

const mockViewerRoleDefinition: UserRoleDefinition = {
  name: 'Viewer',
  code: UserRole.VIEWER,
  permissions: [UserPermission.VIEW],
};

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let dbService: InMemoryDbService;

  const createMockExecutionContext = (
    headers: any,
    handler: (...args: any[]) => any,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
      getHandler: () => handler,
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: InMemoryDbService,
          useValue: {
            findUserById: jest.fn(),
            findRoleDefinitionByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
    dbService = module.get<InMemoryDbService>(InMemoryDbService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no permission is required', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const mockContext = createMockExecutionContext({}, () => {});

    await expect(guard.canActivate(mockContext)).resolves.toBe(true);
  });

  it('should allow access if the user has the required permission', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(UserPermission.CREATE);
    jest.spyOn(dbService, 'findUserById').mockReturnValue(mockAdminUser);
    jest
      .spyOn(dbService, 'findRoleDefinitionByCode')
      .mockReturnValue(mockAdminRoleDefinition);

    const mockContext = createMockExecutionContext(
      { authorization: '1' },
      () => {},
    );

    await expect(guard.canActivate(mockContext)).resolves.toBe(true);
  });

  it('should deny access if the user does not have the required permission', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(UserPermission.CREATE); // Asking for CREATE
    jest.spyOn(dbService, 'findUserById').mockReturnValue(mockViewerUser);
    jest
      .spyOn(dbService, 'findRoleDefinitionByCode')
      .mockReturnValue(mockViewerRoleDefinition);

    const mockContext = createMockExecutionContext(
      { authorization: '6' },
      () => {},
    );

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should deny access if the authorization header is missing', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(UserPermission.CREATE);
    const mockContext = createMockExecutionContext({}, () => {});

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should deny access if the user ID in the header is not a number', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(UserPermission.CREATE);
    const mockContext = createMockExecutionContext(
      { authorization: 'abc' },
      () => {},
    );

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should deny access if the user is not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(UserPermission.CREATE);
    jest.spyOn(dbService, 'findUserById').mockReturnValue(undefined);
    const mockContext = createMockExecutionContext(
      { authorization: '999' },
      () => {},
    );

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
