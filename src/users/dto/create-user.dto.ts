import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { UserRole, UserGroup } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(UserGroup, { each: true })
  groups: UserGroup[];
}
