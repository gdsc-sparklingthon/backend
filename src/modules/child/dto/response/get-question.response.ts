import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetQuestionResponse {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  nextQuestionId: number;
}
