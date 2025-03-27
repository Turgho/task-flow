import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, FindTaskDto } from '../dto';
import { CreateTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase, FindTaskUseCase } from '../use-case';
import { ITaskController } from '../interfaces/task-controller.interface';
import { TaskResponseDto } from '../dto/task-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController implements ITaskController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly updateTask: UpdateTaskUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
    private readonly findTask: FindTaskUseCase,
  ) {}

  @Post('registry')
  create(
    @Body() taskData: CreateTaskDto
  ): Promise<TaskResponseDto> {
    return this.createTask.execute(taskData);
  }

  @Patch(':id/update')
  update(
    @Param('id') taskId,
    @Body() taskData: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    return this.updateTask.execute(taskId, taskData);
  }

  @Delete(':id/delete')
  delete(
    @Param('id') taskId,
    @Body() taskData: DeleteTaskDto
  ): Promise<void> {
    return this.deleteTask.execute(taskId, taskData);
  }

  @Get('search')
  find(
    @Query() taskData: FindTaskDto
  ): Promise<TaskResponseDto | TaskResponseDto[]> {
    return this.findTask.execute(taskData);
  }
}
