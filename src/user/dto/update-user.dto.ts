import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Алексей' })
  name?: string;

  @ApiProperty({ example: 20 })
  age?: number;

  photo?: string;

  @ApiProperty({ example: 'my_very_secure_Password_22443' })
  password?: string;
}
