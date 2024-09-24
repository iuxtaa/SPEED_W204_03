import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { error } from 'console';
import { UserSignupDTO } from '../dto/user-signup.dto';
import { UserService } from '../service/user.service';
import { UserLoginDTO } from '../dto/user-login.dto';
import { UserMessages } from '../enums/user.details';

@Controller('api/users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('/test')
  test() {
    return this.UserService.test();
  }

  // Get all users
  @Get('/signup')
  async getUsersList() {
    try {
      return this.UserService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Users found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // User Signup
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userSignupDTO: UserSignupDTO) {
    try {
      await this.UserService.signup(userSignupDTO);
      return { message: 'New user created successfully' };
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: UserMessages.takenCredentialsMessage,
          },
          HttpStatus.CONFLICT,
          { cause: error },
        );
      } else if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: error.message },
          HttpStatus.BAD_REQUEST,
          { cause: error },
        );
      }
    }
  }

  // User Login
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDTO: UserLoginDTO) {
    try {
      const validatedUser = await this.UserService.login(userLoginDTO);
      return { message: 'User logged in successfully', validatedUser };
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: UserMessages.invalidCredentialsMessage,
          },
          HttpStatus.CONFLICT,
          { cause: error },
        );
      } else if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: error.message },
          HttpStatus.BAD_REQUEST,
          { cause: error },
        );
      } else if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'No users found.' },
          HttpStatus.NOT_FOUND,
          { cause: error },
        );
      }
    }
  }
}
