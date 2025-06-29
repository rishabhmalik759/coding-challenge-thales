import {
  UserRole,
  UserPermission,
  UserRoleDefinition,
} from '../../users/entities/user.entity';

export const ROLES_SEED: UserRoleDefinition[] = [
  {
    name: 'Admin',
    code: UserRole.ADMIN,
    permissions: [
      UserPermission.CREATE,
      UserPermission.VIEW,
      UserPermission.EDIT,
      UserPermission.DELETE,
    ],
  },
  {
    name: 'Personal',
    code: UserRole.PERSONAL,
    permissions: [],
  },
  {
    name: 'Viewer',
    code: UserRole.VIEWER,
    permissions: [UserPermission.VIEW],
  },
];
