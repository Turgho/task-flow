import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { DeleteUserDto } from "../dto/delete-user.dto";

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async execute(id: string, userData: DeleteUserDto): Promise<void> {
    try {
      // Check if user ID has been provided
      if (!id){
        throw new BadRequestException({
          errorCode: 'MISSING_USER_ID',
          message: 'User ID is requised for delete',
        });
      }

      // Delete the task 
      const result = await this.usersRepository.delete(id);

      // Check if the task has been deleted
      if (result.affected === 0){
        throw new BadRequestException({
          errorCode: 'USER_NOT_FOUND',
          message: `User with ID ${id} not found`,
          suggestion: 'Verify the user ID or check if already deleted',
        })
      }

      this.logger.log(`User deleted successfully: ${id}`);
      this.logger.debug(`Deletion reason: ${userData.reason || 'Not specified'}`);

    } catch(error) {
      // Handle specific errors
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `User delete failed for ID ${id}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'USER_DELETE_FAILED',
        message: 'An unexpected error occurred during user delete',
      });
    }
  }
}