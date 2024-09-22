import {
  IsEnum,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { UserStatus } from '../enums/user.status';
import { UserDetails } from '../enums/user.details';
import { UserMessages } from '../enums/user.details';

export class CreateNewUserDTO {
  @IsNotEmpty()
  @MinLength(UserDetails.minFNameLength, {
    message: UserMessages.minFNameLengthMessage,
  })
  firstname: string;

  @IsNotEmpty()
  @MinLength(UserDetails.minLNameLength, {
    message: UserMessages.minLNameLengthMessage,
  })
  lastname: string;

  @IsNotEmpty()
  @MinLength(UserDetails.minUNameLength, {
    message: UserMessages.minUNameLengthMessage,
  })
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: UserDetails.minPassLength,
      minLowercase: UserDetails.minPassLowerCase,
      minUppercase: UserDetails.minPassUpperCase,
      minNumbers: UserDetails.minPassNum,
      minSymbols: UserDetails.minPassSymbol,
    },
    { message: UserMessages.weakPasswordMessage },
  )
  password: string;

  @IsNotEmpty()
  @Matches('password', { message: UserMessages.passwordMismatchMessage })
  passwordConfirmation: string;

  @IsEnum(UserStatus)
  userStatus: UserStatus.General;
}
