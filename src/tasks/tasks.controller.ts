import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskUseCase } from './use-case/create-task.use-case';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskUseCase } from './use-case/update-task.use-case';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
  ) {}

  @Post('create')
  create(@Body() taskData: CreateTaskDto){
    return this.createTaskUseCase.execute(taskData);
  }

  @Post('update')
  update(@Body() taskData: UpdateTaskDto){
    return this.updateTaskUseCase.execute(taskData);
  }
}
