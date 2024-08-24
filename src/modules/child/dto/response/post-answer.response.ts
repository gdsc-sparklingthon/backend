import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PostAnswerResponse {
  @ApiProperty()
  @IsString()
  point: number;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsNumber()
  questionId: number;
}
