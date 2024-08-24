import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
  @ApiProperty({ description: 'The name of the child', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'The age of the child', example: '10' })
  age: string;

  @ApiProperty({ description: 'The gender of the child', example: 'Male' })
  gender: string;
}
