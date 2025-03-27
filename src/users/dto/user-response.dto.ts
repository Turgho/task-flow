import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    example: '738a0fe6-a5d4-444d-85c0-93ff31f98fb9',
    description: 'User ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'john.doe',
    description: 'Username',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email',
  })
  @Expose()
  email: string;
}