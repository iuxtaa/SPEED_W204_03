import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserSignupDTO } from '../dto/user-signup.dto';
import { UserLoginDTO } from '../dto/user-login.dto';
import { UserUpdateDTO } from '../dto/update-user.dto';
import { UserStatus } from '../enums/user.status';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    test: jest.fn(() => 'user route testing'),
    findAll: jest.fn(),
    signup: jest.fn(),
    login: jest.fn(),
    createNewUser: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('test', () => {
    it('should return "user route testing"', () => {
      expect(userController.test()).toBe('user route testing');
      expect(mockUserService.test).toHaveBeenCalled();
    });
  });

  // TO FIX

//   describe('getUsersList', () => {
//     it('should return users list', async () => {
//       const result = [{ username: 'user1' }, { username: 'user2' }];
//       mockUserService.findAll.mockResolvedValue(result);

//       expect(await userController.getUsersList()).toBe(result);
//       expect(mockUserService.findAll).toHaveBeenCalled();
//     });

//     it('should throw HttpException if no users found', async () => {
//       mockUserService.findAll.mockRejectedValue(new Error('No Users found'));

//       await expect(userController.getUsersList()).rejects.toThrow(HttpException);
//     });
//   });

  describe('signup', () => {
    it('should return success message and user', async () => {
      const userSignupDTO: UserSignupDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        passwordConfirmation: 'StrongPassword123!',
        // status: UserStatus.General,
      };

      const result = { username: 'johndoe' };
      mockUserService.signup.mockResolvedValue(result);

      expect(await userController.signup(userSignupDTO)).toEqual({
        message: 'New user created successfully',
        user: result,
      });
      expect(mockUserService.signup).toHaveBeenCalledWith(userSignupDTO);
    });

    it('should throw HttpException on conflict', async () => {
      const userSignupDTO: UserSignupDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        passwordConfirmation: 'StrongPassword123!',
        // status: UserStatus.General,
      };

      mockUserService.signup.mockRejectedValue({ status: HttpStatus.CONFLICT });

      await expect(userController.signup(userSignupDTO)).rejects.toThrow(HttpException);
    });
  });

  describe('login', () => {
    it('should return success message and validated user', async () => {
      const userLoginDTO: UserLoginDTO = {
        username: 'johndoe',
        password: 'StrongPassword123!',
      };

      const result = { username: 'johndoe' };
      mockUserService.login.mockResolvedValue(result);

      expect(await userController.login(userLoginDTO)).toEqual({
        message: 'User logged in successfully',
        validatedUser: result,
      });
      expect(mockUserService.login).toHaveBeenCalledWith(userLoginDTO);
    });

    it('should throw HttpException on unauthorized', async () => {
      const userLoginDTO: UserLoginDTO = {
        username: 'johndoe',
        password: 'StrongPassword123!',
      };

      mockUserService.login.mockRejectedValue({ status: HttpStatus.NOT_FOUND });

      await expect(userController.login(userLoginDTO)).rejects.toThrow(HttpException);
    });
  });

  describe('createNewUser', () => {
    it('should return success message', async () => {
      const createNewUserDTO: UserSignupDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        passwordConfirmation: 'StrongPassword123!',
        // status: UserStatus.General,
      };

      mockUserService.createNewUser.mockResolvedValue(null);

      expect(await userController.createNewUser(createNewUserDTO)).toEqual({
        message: 'New user created successfully',
      });
      expect(mockUserService.createNewUser).toHaveBeenCalledWith(createNewUserDTO);
    });

    it('should throw HttpException on error', async () => {
      const createNewUserDTO: UserSignupDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        passwordConfirmation: 'StrongPassword123!',
        // status: UserStatus.General,
      };

      mockUserService.createNewUser.mockRejectedValue(new Error('Error'));

      await expect(userController.createNewUser(createNewUserDTO)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should return success message', async () => {
      const updateUserDTO: UserUpdateDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        password: 'StrongPassword123!',
        status: UserStatus.General,
      };

      mockUserService.update.mockResolvedValue(null);

      expect(await userController.update('1', updateUserDTO)).toEqual({
        message: 'User updated successfully',
      });
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDTO);
    });

    it('should throw HttpException on conflict', async () => {
      const updateUserDTO: UserUpdateDTO = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        password: 'StrongPassword123!',
        status: UserStatus.General,
      };

      mockUserService.update.mockRejectedValue({ status: HttpStatus.CONFLICT });

      await expect(userController.update('1', updateUserDTO)).rejects.toThrow(HttpException);
    });
  });
});