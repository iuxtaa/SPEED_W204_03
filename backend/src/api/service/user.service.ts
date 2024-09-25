import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserSignupDTO } from '../dto/user-signup.dto';
import { UserMessages } from '../enums/user.details';
import { UserStatus } from '../enums/user.status';
import { UserLoginDTO } from '../dto/user-login.dto';
import { UserUpdateDTO } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  test(): string {
    return 'user route testing';
  }
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async signup(UserSignupDTO: UserSignupDTO) {
    const { username, email, password, passwordConfirmation } = UserSignupDTO;

    this.checkPasswordConfirmation(password, passwordConfirmation);
    await this.checkIfUserExists(username, email);

    return await this.userModel.create({
      ...UserSignupDTO,
      status: UserStatus.General,
    });
  }

  async login(UserLoginDTO: UserLoginDTO) {
    const { username, password } = UserLoginDTO;
    const user = await this.findUser(username);
    if (!user) {
      throw new UnauthorizedException(UserMessages.invalidCredentialsMessage);
    }
    this.checkPasswordConfirmation(password, user.password);

    return {
      message: 'User log in successful',
      user: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    };
  }

  async createNewUser(CreateNewUserDTO: UserSignupDTO) {
    const { username, email, password, passwordConfirmation } =
      CreateNewUserDTO;

    this.checkPasswordConfirmation(password, passwordConfirmation);
    await this.checkIfUserExists(username, email);

    return await this.userModel.create({
      ...CreateNewUserDTO,
    });
  }

  async update(id: string, updateUserDTO: UserUpdateDTO): Promise<User> {
    const { username } = updateUserDTO;

    const existingUserByUsername = await this.userModel.findOne({ username });
    if (existingUserByUsername) {
      throw new ConflictException(UserMessages.takenCredentialsMessage);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDTO, { new: true })
      .exec();
  }

  private checkPasswordConfirmation(
    password: string,
    passwordConfirmation: string,
  ) {
    if (password !== passwordConfirmation) {
      throw new BadRequestException(UserMessages.passwordMismatchMessage);
    }
  }

  private async checkIfUserExists(
    username: string,
    email: string,
  ): Promise<void> {
    const existingUserByUsername = await this.userModel.findOne({ username });
    const existingUserByEmail = await this.userModel.findOne({ email });

    if (existingUserByUsername) {
      throw new ConflictException(UserMessages.takenCredentialsMessage);
    }

    if (existingUserByEmail) {
      throw new ConflictException(UserMessages.takenCredentialsMessage);
    }
  }

  private async findUser(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username });
  }
}
