import { IsEnum, IsString, IsEmail, IsStrongPassword } from 'class-validator';
import { UserStatus } from '../enums/user.status';

export class CreateNewUserDTO {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserStatus)
  userStatus: UserStatus;
}
