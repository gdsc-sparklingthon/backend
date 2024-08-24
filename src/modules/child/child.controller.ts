import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostAnswerResponse } from './dto/response/post-answer.response';
import { PostAnswerRequest } from './dto/request/post-answer.request';
import { GetQuestionResponse } from './dto/response/get-question.response';
import { ChildService } from './child.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('child')
@ApiTags('Child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @ApiOperation({ summary: '첫 질문 요청 API' })
  @UseGuards(AuthGuard('jwt'))
  @Get('question')
  async getFirstResponse(@Request() req): Promise<GetQuestionResponse> {
    const childId = req.user.userId;
    return await this.childService.getFirstResponse(childId);
  }

  @ApiOperation({ summary: '답변 API' })
  @UseGuards(AuthGuard('jwt'))
  @Post(':questionId/answer')
  async postAnswer(
    @Body() postAnswerRequest: PostAnswerRequest,
    @Param('questionId') questionId: number,
    @Request() req,
  ): Promise<PostAnswerResponse> {
    const childId = req.user.userId;
    return await this.childService.postAnswerRequest(
      childId,
      questionId,
      postAnswerRequest,
    );
  }
}
