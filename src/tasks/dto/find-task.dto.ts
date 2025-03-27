import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindTaskDto {
  @ApiPropertyOptional({
    description: 'Task ID',
    example: '6708137f-05b8-457a-8523-24055b98a42e'
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'pending'
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    example: 'high'
  })
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '738a0fe6-a5d4-444d-85c0-93ff31f98fb9'
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
}