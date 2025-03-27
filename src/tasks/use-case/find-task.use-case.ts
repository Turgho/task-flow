import { 
  Injectable, 
  NotFoundException,
  Logger, 
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { FindTaskDto } from '../dto/find-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindTaskUseCase {
  private readonly logger = new Logger(FindTaskUseCase.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  /**
   * Finds task(s) based on criteria
   * @param criteria Search criteria (id, status, userId)
   * @returns Single task or task array
   * @throws NotFoundException if single task not found
   */
  async execute(criteria: FindTaskDto): Promise<TaskResponseDto | TaskResponseDto[]> {
    try {
      // Single task by ID
      if (criteria?.id) {
        const task = await this.tasksRepository.findOne({ 
          where: { id: criteria.id },
          relations: ['user'] 
        });

        // Check if the task has been founded
        if (!task) {
          throw new NotFoundException({
            errorCode: 'TASK_NOT_FOUND',
            message: `Task ${criteria.id} not found`,
            suggestion: 'Verify the task ID or check if the task exists',
          });
        }
        
        return plainToInstance(TaskResponseDto, task, {
          excludeExtraneousValues: true,
        });
      }

      // Multiple tasks (FILTERED)
      const queryBuilder = this.tasksRepository.createQueryBuilder('task');

      // By user ID
      if (criteria.userId) {
        queryBuilder.where('task.userId = :userId', { userId: criteria.userId });
      }

      // By task status
      if (criteria.status) {
        queryBuilder.andWhere('task.status = :status', { status: criteria.status });
      }

      // By task priority
      if (criteria.priority) {
        queryBuilder.andWhere('task.priority = :priority', { priority: criteria.priority });
      }

      queryBuilder.leftJoinAndSelect('task.user', 'user');

      // Get the tasks
      const tasks = await queryBuilder.getMany();

      if (tasks.length === 0) {
        this.logger.warn(`No tasks found with criteria: ${JSON.stringify(criteria)}`);
      }

      this.logger.log(`Tasks founded: ${JSON.stringify(tasks.length)}`);

      return plainToInstance(TaskResponseDto, tasks, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `Task find failed for ID ${criteria.id}`,
        error.stack || error
      );
      
      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'TASK_FIND_FAILED',
        message: 'An unexpected error occurred during task find',
      });
    }
  }
}