import { IsNotEmpty, Min, MinLength } from 'class-validator';
import { UserDetails } from '../enums/user.details';
import { UserMessages } from '../enums/user.details';

export class UserLoginDTO {
  @IsNotEmpty()
  @MinLength(UserDetails.minUNameLength, {
    message: UserMessages.minUNameLengthMessage,
  })
  username: string;

  @IsNotEmpty()
  @MinLength(UserDetails.minPassLength, {
    message: UserMessages.minPassLengthMessage,
  })
  password: string;
}
