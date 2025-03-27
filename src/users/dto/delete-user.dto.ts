import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class DeleteUserDto {
  @ApiProperty({
    description: 'Reason to delete the user',
    example: 'Dont like the app',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}