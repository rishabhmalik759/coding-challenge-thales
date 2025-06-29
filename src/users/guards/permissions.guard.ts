import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermission } from '../entities/user.entity';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { InMemoryDbService } from '../../database/in-memory-db.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private db: InMemoryDbService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<UserPermission>(
      REQUIRED_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userIdHeader = request.headers['Authorization'];

    if (!userIdHeader) {
      throw new ForbiddenException('Authorization header is missing.');
    }

    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      throw new ForbiddenException('Invalid user ID in Authorization header.');
    }

    const user = this.db.findUserById(userId);
    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    const userPermissions = new Set<UserPermission>();

    for (const userRoleCode of user.roles) {
      const roleDefinition = this.db.findRoleDefinitionByCode(userRoleCode);

      if (roleDefinition) {
        for (const permission of roleDefinition.permissions) {
          userPermissions.add(permission);
        }
      }
    }

    if (userPermissions.has(requiredPermission)) {
      return true;
    } else {
      throw new ForbiddenException(
        'ERROR: Not allowed to perform action due to insufficient permissions.',
      );
    }
  }
}
