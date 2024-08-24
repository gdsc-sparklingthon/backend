import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostAnswerResponse } from './dto/response/post-answer.response';
import { PostAnswerRequest } from './dto/request/post-answer.request';
import { GetQuestionResponse } from './dto/response/get-question.response';
import { ChildService } from './child.service';

@Controller('')
@ApiTags('Child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @ApiOperation({ summary: '첫 질문 요청 API' })
  @Get()
  async getFirstResponse(): Promise<GetQuestionResponse> {
    return await this.childService.getFirstResponse(1);
  }

  @ApiOperation({ summary: '답변 API' })
  @Post('answer/:questionId')
  async postAnswer(
    @Body() postAnswerRequest: PostAnswerRequest,
    @Param('questionId') questionId: number,
  ): Promise<PostAnswerResponse> {
    return await this.childService.postAnswerRequest(
      questionId,
      postAnswerRequest,
    );
  }
}
