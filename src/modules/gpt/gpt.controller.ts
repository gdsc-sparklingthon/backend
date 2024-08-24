import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
@ApiTags('gpt')
export class GptController {
  constructor(private readonly gptSerivce: GptService) {}

  @ApiOperation({ summary: '첫 질문 요청 API' })
  @Get()
  async getFirstResponse(): Promise<string> {
    return await this.gptSerivce.getPoint(
      '오늘 기본이 좋은가요',
      '기분 최고에요!!',
    );
  }
}
