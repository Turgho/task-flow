// src/tasks/dto/task-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Exclude()
export class TaskResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier of the task',
    example: '6708137f-05b8-457a-8523-24055b98a42e' 
  })
  @Expose()
  id: string;

  @ApiProperty({ 
    description: 'Title of the task',
    example: 'Updated task name' 
  })
  @Expose()
  title: string;

  @ApiProperty({ 
    description: 'Detailed description of the task',
    example: 'Updated task description',
    required: false
  })
  @Expose()
  description?: string; // Made optional

  @ApiProperty({ 
    description: 'Due date in ISO format',
    example: '2023-12-31T23:59:59.999Z',
    required: false
  })
  @Expose()
  dueDate?: string; // Made optional

  @ApiProperty({ 
    description: 'Priority level of the task',
    enum: ['low', 'medium', 'high'],
    example: 'high'
  })
  @Expose()
  priority: string;

  @ApiProperty({ 
    description: 'Current status of the task',
    enum: ['pending', 'in_progress', 'completed'],
    example: 'in_progress'
  })
  @Expose()
  status: string;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2025-03-26T05:18:58.579Z' 
  })
  @Expose()
  createdAt: string;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2025-03-26T22:56:33.977Z' 
  })
  @Expose()
  updatedAt: string;

  @ApiProperty({
    description: 'Assigned user information (simplified)',
    type: () => UserResponseDto, // Reference to a user DTO
    required: false,
    example: {
      id: '738a0fe6-a5d4-444d-85c0-93ff31f98fb9',
      username: 'John Doe',
      email: 'john.doe@example.com'
    }
  })
  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      username: value.username,
      email: value.email
    };
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto | null;
}