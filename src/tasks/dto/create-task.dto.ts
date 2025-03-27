import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    description: 'The user_id to create task',
    example: '738a0fe6-a5d4-444d-85c0-93ff31f98fb9',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'The title of task',
    example: 'Buy oranges',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of task',
    example: 'Buy some oranges on the supermarket',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The due date to realize the task',
    example: '2025-05-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: 'The priorioty of task',
    example: 'low',
  })
  @IsString()
  priority: string;

  @ApiProperty({
    description: 'The status of task',
    example: 'pending',
  })
  @IsString()
  status: string;
}
