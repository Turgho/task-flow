import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async execute(taskData: CreateTaskDto): Promise<Task> {
    try {
      // Check if user_id exists
      if (!taskData?.user_id) {
        throw new BadRequestException('User ID is required');
      }

      // Find the task
      const user = await this.usersService.findById(taskData.user_id);
      if (!user) {
        throw new NotFoundException(`User with ID ${taskData.user_id} not found`);
      }

      // Create task entity
      const task = this.tasksRepository.create({
        ...taskData,
        user: user,
      });

      // Save the task
      const savedTask = await this.tasksRepository.save(task);
      
      if (!savedTask) {
        throw new InternalServerErrorException('Failed to persist task in database');
      }

      return savedTask as Task;

    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Log the full error for debugging
      console.error('Error in CreateTaskUseCase:', error);
      
      throw new InternalServerErrorException('Failed to create task');
    }
  }
}