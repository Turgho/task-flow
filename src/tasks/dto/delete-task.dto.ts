import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DeleteTaskDto {
  @ApiProperty({
    description: 'Reason to delete the task',
    example: 'Duplicated task',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}