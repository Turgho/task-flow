import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { PasswordHasherService } from "src/users/services/passwordHasher/passwordHasher.service";

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: PasswordHasherService,
  ) {}

  /**
   * Executes the user update process
   * @param userId User id to update
   * @param userData Data Transfer Object containing update fields
   * @returns Updated User entity
   * @throws NotFoundException if user doesn't exist
   * @throws BadRequestException for invalid updates
   * @throws InternalServerErrorException for persistence failures
   */
  async execute(userId: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user exists
      const existingUser = await this.usersRepository.findOne({
        where: { id: userId }
      });

      if (!existingUser) {
        this.logger.warn(`User not found for update: ${userId}`);
        throw new NotFoundException({
          errorCode: 'USER_NOT_FOUND',
          message: `User with ID ${userId} not found`,
          suggestion: 'Verify the user ID or create a user first',
        });
      }

      // Validate no restricted fields are being updated
      if ('createdAt' in userData || 'user' in userData) {
        throw new BadRequestException({
          errorCode: 'INVALID_UPDATE_FIELDS',
          message: 'Cannot modify creation date or user ownership',
        });
      }

      // Update the password if provided
      if (userData.password) {
        userData.password = await this.hashService.hashPassword(userData.password);
      }

      // Update only the provided fields
      Object.assign(existingUser, userData);

      // Save the updated user
      const updatedUser = await this.usersRepository.save(existingUser);
      
      this.logger.log(`User updated successfully: ${userId}`);

      return plainToInstance(UserResponseDto, updatedUser, {
        excludeExtraneousValues: true,
      });

    } catch(error) {
      // Handle specific errors
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `User update failed for ID ${userId}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'USER_UPDATE_FAILED',
        message: 'An unexpected error occurred during user update',
      });
    }
  }
}