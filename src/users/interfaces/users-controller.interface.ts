import { CreateUserDto } from "../dto/create-user.dto";
import { DeleteUserDto } from "../dto/delete-user.dto";
import { FindUserDto } from "../dto/find-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";

export interface IUsersController {
  create(userData: CreateUserDto): Promise<UserResponseDto>;
  update(id: string, userData: UpdateUserDto): Promise<UserResponseDto>;
  delete(id: string, userData: DeleteUserDto): Promise<void>;
  find(id: string, userData: FindUserDto): Promise<UserResponseDto>;
}