import { 
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteTaskDto } from "../dto/delete-task.dto";


export class DeleteTaskUseCase {
  private readonly logger = new Logger(DeleteTaskUseCase.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async execute(taskId: string, taskData: DeleteTaskDto): Promise<void> {
    try {
      // Check if task ID has been provided
      if (taskId){
        throw new BadRequestException({
          errorCode: 'MISSING_TASK_ID',
          message: 'Task ID is required for delete',
        });
      }
  
      // Delete the task 
      const result = await this.tasksRepository.delete(taskId);

      // Check if the task has been deleted
      if (result.affected === 0){
        throw new BadRequestException({
          errorCode: 'TASK_NOT_FOUND',
          message: `Task with ID ${taskId} not found`,
          suggestion: 'Verify the task ID or check if already deleted',
        })
      }

      this.logger.log(`Task deleted successfully: ${taskId}`);
      this.logger.debug(`Deletion reason: ${taskData.reason || 'Not specified'}`);
      
    } catch(error) {
      // Handle specific errors
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log technical details
      this.logger.error(
        `Task delete failed for ID ${taskId}`,
        error.stack || error
      );

      // Throw generic server error
      throw new InternalServerErrorException({
        errorCode: 'TASK_DELETE_FAILED',
        message: 'An unexpected error occurred during task delete',
      });
    }
  }
}