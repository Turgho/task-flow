import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../../users/services/users.service";
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  Logger 
} from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskResponseDto } from "../dto/task-response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Executes the task creation process
   * @param taskData Data Transfer Object for task creation
   * @returns The created Task entity
   * @throws NotFoundException if user doesn't exist
   * @throws BadRequestException for invalid input
   * @throws InternalServerErrorException for database failures
   */
  async execute(taskData: CreateTaskDto): Promise<TaskResponseDto> {
    try {
      // Check if user_id exists
      if (!taskData?.user_id) {
        throw new BadRequestException({
          errorCode: 'MISSING_USER_ID',
          message: 'User ID is required',
        });
      }

      // Find the task
      const user = await this.usersService.findById(taskData.user_id);
      if (!user) {
        this.logger.warn(`User not found: ${taskData.user_id}`);
        throw new NotFoundException({
          errorCode: 'USER_NOT_FOUND',
          message: `User with ID ${taskData.user_id} not found`,
          suggestion: 'Verify the user ID or register the user first'
        });
      }

      // Create task entity
      const task = this.tasksRepository.create({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status || 'pending', // Default value
        user: user, // Establish relationship
      });

      // Save the task
      const savedTask = await this.tasksRepository.save(task);
      
      if (!savedTask) {
        throw new InternalServerErrorException({
          errorCode: 'TASK_PERSISTENCE_FAILED',
          message: 'Failed to save task to database',
        });
      }

      this.logger.log(`Task created successfully: ${savedTask.id}`);
      
      return plainToInstance(TaskResponseDto, savedTask, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      // Re-throw known exception types
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `Task creation failed for user ${taskData.user_id}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'TASK_CREATION_FAILED',
        message: 'An unexpected error occurred during task creation',
      });
    }
  }
}