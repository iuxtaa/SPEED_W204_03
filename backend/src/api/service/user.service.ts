import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateNewUserDTO } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  test(): string {
    return 'user route testing';
  }
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async signup(CreateNewUserDTO: CreateNewUserDTO) {
    return await this.userModel.create(CreateNewUserDTO);
  }
}
