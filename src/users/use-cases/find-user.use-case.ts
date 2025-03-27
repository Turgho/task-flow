import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { FindUserDto } from "../dto/find-user.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { plainToInstance } from "class-transformer";


export class FindUserUseCase {
  private readonly logger = new Logger(FindUserUseCase.name);

  constructor(
    private readonly usersRepository: Repository<User>,
  ) {}

  async execute(userId: string, criteria: FindUserDto): Promise<UserResponseDto> {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('user');

      // Conmbined filters (AND)
      // Find by ID
      if (userId) {
        queryBuilder.andWhere('user.id = :id', { id: userId });
      }
      // Find by username
      if (criteria.username) {
        queryBuilder.andWhere('user.username = :username', { username: criteria.username });
      }
      // Find by email
      if (criteria.email) {
        queryBuilder.andWhere('user.email = :email', { email: criteria.email });
      }

      const user = await queryBuilder.getOne();

      if (!user) {
        throw new NotFoundException({
          errorCode: 'USER_NOT_FOUND',
          message: 'No user found with the given criteria',
          suggestion: 'Check the search parameters or try different ones',
        });
      }

      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }); 

    } catch(error) {
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `User search failed for ID ${userId}`,
        error.stack || error
      );

      // Throw generic server error
      throw new BadRequestException({
        errorCode: 'USER_SEARCH_FAILED',
        message: 'Failed to search for user',
        details: error.message,
      });
    }
  }
}