import {
  IsEnum,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { UserDetails } from '../enums/user.details';
import { UserMessages } from '../enums/user.details';

export class UserUpdateDTO {
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
}
