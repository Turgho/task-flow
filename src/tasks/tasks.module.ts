import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskUseCase } from './use-case/create-task.use-case';
import { UsersModule } from 'src/users/users.module';
import { UpdateTaskUseCase } from './use-case/update-task.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    TasksService
  ],
})
export class TasksModule {}
