import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';

import { 
  CreateTaskUseCase, 
  DeleteTaskUseCase, 
  FindTaskUseCase, 
  UpdateTaskUseCase 
} from './use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    FindTaskUseCase,
  ],
})
export class TasksModule {}
