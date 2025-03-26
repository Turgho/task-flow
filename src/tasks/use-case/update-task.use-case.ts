import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateTaskDto } from "../dto/update-task.dto";

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async execute(taskData: UpdateTaskDto): Promise<Task> {
    try {
      // Check if task exists
      const task = await this.tasksRepository.findOne({ 
        where: { id: taskData.id } 
      });
      
      if (!task) {
        throw new NotFoundException(`Task com ID ${taskData.id} não encontrada`);
      }

      // Remove the ID not to update
      const { id, ...updateFields } = taskData;

      // Update only the provides fields
      Object.assign(task, updateFields);

      // Save the updated task
      const savedTask = await this.tasksRepository.save(task);
      
      return savedTask as Task;
      
    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Log the full error for debugging
      console.error('Falha ao atualizar task:', error);
      
      throw new InternalServerErrorException('Falha ao atualizar a task');
    }
  }
}