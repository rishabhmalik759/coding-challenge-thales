import { SetMetadata } from '@nestjs/common';
import { UserPermission } from '../entities/user.entity';

export const REQUIRED_PERMISSION_KEY = 'requiredPermission';

export const RequirePermission = (permission: UserPermission) =>
  SetMetadata(REQUIRED_PERMISSION_KEY, permission);
