import { Injectable } from '@nestjs/common';
import { UserGroup, UserRole, User } from 'src/users/entities/user.entity';

@Injectable()
export class InMemoryDbService {
  public readonly roles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.PERSONAL,
    UserRole.VIEWER,
  ];
  public readonly groups: UserGroup[] = [UserGroup.GROUP_1, UserGroup.GROUP_2];

  public readonly users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      roles: [UserRole.ADMIN, UserRole.PERSONAL],
      groups: [UserGroup.GROUP_1, UserGroup.GROUP_2],
    },
    {
      id: 2,
      name: 'Grabriel Monroe',
      roles: [UserRole.PERSONAL],
      groups: [UserGroup.GROUP_1, UserGroup.GROUP_2],
    },
    {
      id: 3,
      name: 'Alex Xavier',
      roles: [UserRole.PERSONAL],
      groups: [UserGroup.GROUP_2],
    },
    {
      id: 4,
      name: 'Jarvis Khan',
      roles: [UserRole.ADMIN, UserRole.PERSONAL],
      groups: [UserGroup.GROUP_2],
    },
    {
      id: 5,
      name: 'Martines Polok',
      roles: [UserRole.ADMIN, UserRole.PERSONAL],
      groups: [UserGroup.GROUP_1],
    },
    {
      id: 6,
      name: 'Gabriela Wozniak',
      roles: [UserRole.VIEWER, UserRole.PERSONAL],
      groups: [UserGroup.GROUP_1],
    },
  ];
}
