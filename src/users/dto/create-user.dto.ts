import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class CreateUserDto {
  @ApiProperty({
    description: 'The username of user.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of user.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of user.',
    example: 'JohnDoe123!',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
