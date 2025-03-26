import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/auth/hash/hash.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: [{ email: createUserDto.email }, { username: createUserDto.username }],
      });

      if (existingUser) {
        throw new ConflictException('User with this email or username already exists');
      }

      // Hash the password
      const hashedPassword = await this.hashService.hashPassword(createUserDto.password);

      // Create user entity
      const user = this.usersRepository.create({
        ...createUserDto,
        passwordHash: hashedPassword,
      });

      // Save the user
      const savedUser = await this.usersRepository.save(user);
      
      if (!savedUser) {
        throw new InternalServerErrorException('Failed to persist user in database');
      }

      // Remove sensitive data before returning
      const { passwordHash, ...result } = savedUser;
      return result as User;

    } catch (error) {
      // Handle specific errors
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      // Log the full error for debugging
      console.error('Error in CreateUserUseCase:', error);
      
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}