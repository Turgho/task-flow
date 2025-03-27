import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  Logger 
} from "@nestjs/common";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { TaskResponseDto } from "../dto/task-response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UpdateTaskUseCase {
  private readonly logger = new Logger(UpdateTaskUseCase.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  /**
   * Executes the task update process
   * @param taskData Data Transfer Object containing update fields
   * @returns Updated Task entity
   * @throws NotFoundException if task doesn't exist
   * @throws BadRequestException for invalid updates
   * @throws InternalServerErrorException for persistence failures
   */
  async execute(taskId: string, taskData: UpdateTaskDto): Promise<TaskResponseDto> {
    try {
      // Check if task ID has been provided
      if (!taskId) {
        throw new BadRequestException({
          errorCode: 'MISSING_TASK_ID',
          message: 'Task ID is required for update',
        });
      }

      // Check if task exists
      const existingTask = await this.tasksRepository.findOne({ 
        where: { id: taskId } 
      });
      
      if (!existingTask) {
        this.logger.warn(`Task not found for update: ${taskId}`);
        throw new NotFoundException({
          errorCode: 'TASK_NOT_FOUND',
          message: `Task with ID ${taskId} not found`,
          suggestion: 'Verify the task ID or create the task first'
        });
      }
      
      // Validate no restricted fields are being updated
      if ('createdAt' in taskData || 'user' in taskData) {
        throw new BadRequestException({
          errorCode: 'INVALID_UPDATE_FIELDS',
          message: 'Cannot modify creation date or task ownership',
        });
      }

      // Update only the provides fields
      Object.assign(existingTask, taskData);

      // Save the updated task
      const updatedTask = await this.tasksRepository.save(existingTask);
      
      this.logger.log(`Task updated successfully: ${updatedTask.id}`);

      return plainToInstance(TaskResponseDto, updatedTask, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `Task update failed for ID ${taskId}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'TASK_UPDATE_FAILED',
        message: 'An unexpected error occurred during task update',
      });
    }
  }
}