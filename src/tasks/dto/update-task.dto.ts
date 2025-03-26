import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsString, IsUUID } from "class-validator";


export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsUUID()
  @IsString()
  id: string;
}