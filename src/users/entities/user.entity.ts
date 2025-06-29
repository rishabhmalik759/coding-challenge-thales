export enum UserRole {
  ADMIN = 'ADMIN',
  PERSONAL = 'PERSONAL',
  VIEWER = 'VIEWER',
}

export enum UserGroup {
  GROUP_1 = 'GROUP_1',
  GROUP_2 = 'GROUP_2',
}

export enum UserPermission {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

export interface User {
  id: number;
  name: string;
  roles: UserRole[];
  groups: UserGroup[];
}

export interface UserRoleDefinition {
  name: string;
  code: UserRole;
  permissions: UserPermission[];
}
