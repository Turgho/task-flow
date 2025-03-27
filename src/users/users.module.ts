import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { PasswordHasherModule } from 'src/users/services/passwordHasher/passwordHasher.module';

import {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  FindUserUseCase
} from './use-cases';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PasswordHasherModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}