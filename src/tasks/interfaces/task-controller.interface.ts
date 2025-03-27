import { TaskResponseDto } from "../dto/task-response.dto";
import { CreateTaskDto, DeleteTaskDto, FindTaskDto, UpdateTaskDto } from "../dto";

export interface ITaskController {
  create(taskData: CreateTaskDto): Promise<TaskResponseDto>;
  update(taskId: string, taskData: UpdateTaskDto): Promise<TaskResponseDto>;
  delete(taskId: string, taskData: DeleteTaskDto): Promise<void>;
  find(taskData: FindTaskDto): Promise<TaskResponseDto | TaskResponseDto[]>;
}