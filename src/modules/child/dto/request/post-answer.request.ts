import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class PostAnswerRequest {
  @ApiProperty()
  @IsBoolean()
  isFirst: boolean;

  @ApiProperty()
  @IsString()
  answer: string;
}
