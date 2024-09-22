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
import { CreateNewUserDTO } from '../dto/create-user.dto';
import { UserService } from '../service/user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('/test')
  test() {
    return this.UserService.test();
  }

  // Get all users
  @Get('/')
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

  // Create a new user
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createNewUserDTO: CreateNewUserDTO) {
    try {
      await this.UserService.signup(createNewUserDTO);
      return { message: 'New user created successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to create new user',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
