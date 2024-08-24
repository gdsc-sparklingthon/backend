import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostAnswerResponse {
  @ApiProperty()
  @IsString()
  @IsOptional()
  point?: number;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsNumber()
  questionId: number;
}
