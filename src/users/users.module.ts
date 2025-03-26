import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from 'src/auth/hash/hash.module';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
