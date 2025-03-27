import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { IUsersController } from "../interfaces/users-controller.interface";
import { ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from "../dto/user-response.dto";
import { CreateUserUseCase, DeleteUserUseCase, FindUserUseCase, UpdateUserUseCase } from "../use-cases";
import { CreateUserDto, DeleteUserDto, FindUserDto, UpdateUserDto } from "../dto";

@ApiTags('Users')
@Controller('users')
export class UsersController implements IUsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly findUser: FindUserUseCase,
  ) {}

  @Post('registry')
  create(
    userData: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.createUser.execute(userData);
  }

  @Patch(':id/update')
  update(
    @Param() userId: string,
    @Body() userData: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.updateUser.execute(userId, userData);
  }

  @Delete(':id/delete')
  delete(
    @Param() userId: string,
    @Body() userData: DeleteUserDto
  ): Promise<void> {
    return this.deleteUser.execute(userId, userData);
  }

  @Get(':id/search')
  find(
    @Param() userId: string,
    @Body() userData: FindUserDto
  ): Promise<UserResponseDto> {
    return this.findUser.execute(userId, userData);
  }
}