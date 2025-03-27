import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Updated task title',
    example: 'Updated task name',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated task description',
    example: 'Updated task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // Explicitly declare other updatable fields (recommended)
  @ApiPropertyOptional({
    description: 'Updated due date (ISO string)',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Updated task priority',
    example: 'high',
    enum: ['low', 'medium', 'high']
  })
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Updated task status',
    example: 'in_progress',
    enum: ['pending', 'in_progress', 'completed']
  })
  @IsOptional()
  status?: string;
}