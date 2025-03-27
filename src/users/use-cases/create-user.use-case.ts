import { 
  BadRequestException, 
  ConflictException, 
  HttpException, 
  HttpStatus, 
  Injectable, 
  InternalServerErrorException,
  Logger 
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordHasherService } from 'src/users/services/passwordHasher/passwordHasher.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: PasswordHasherService,
  ) {}

  /**
   * Executes the user creation process
   * @param createUserDto Data Transfer Object for user creation
   * @returns User entity without sensitive data
   * @throws HttpException in case of business logic errors
   * @throws InternalServerErrorException for unexpected failures
   */
  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: [
          { email: createUserDto.email }, 
          { username: createUserDto.username }
        ],
      });

      if (existingUser) {
        this.logger.warn(`Duplicate registration attempt for: ${createUserDto.email}`);
        throw new HttpException(
          {
            errorCode: 'USER_ALREADY_EXISTS',
            message: 'User with this email or username already exists',
            resolution: 'Try password recovery or use different credentials',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Hash the password
      const hashedPassword = await this.hashService.hashPassword(
        createUserDto.password
      );

      // Create user entity
      const user = this.usersRepository.create({
        ...createUserDto,
        passwordHash: hashedPassword, // Store only the hashed version
      });

      // Save the user
      const savedUser = await this.usersRepository.save(user);
      
      if (!savedUser) {
        throw new InternalServerErrorException({
          errorCode: 'DB_OPERATION_FAILED',
          message: 'Failed to persist user record',
        });
      }

      this.logger.log(`User created successfully: ${savedUser.email}`);
      
      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      // Re-throw known exception types
      if (
        error instanceof ConflictException || 
        error instanceof BadRequestException ||
        error instanceof HttpException
      ) {
        throw error;
      }

      // Log technical details (without exposing sensitive data)
      this.logger.error(
        `User creation failed for ${createUserDto.email}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'USER_CREATION_FAILED',
        message: 'An unexpected error occurred during user registration',
      });
    }
  }
}