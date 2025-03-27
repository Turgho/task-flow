import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from "class-validator";


export class UpdateUserDto {
  @ApiProperty({
    description: 'The update username of user.',
    example: 'Marcus Doe',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'The update email of user.',
    example: 'Marcus.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The update password of user.',
    example: 'MarcusDoe123!',
  })
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
