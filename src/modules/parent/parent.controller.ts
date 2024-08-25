import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateChildDto } from './dto/create-child.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Child } from '../../entities/child.entity';

@ApiTags('parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/child')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '자식 등록 API' })
  async registerChild(
    @Body() createChildDto: CreateChildDto,
    @Request() req,
  ): Promise<{ code: string }> {
    const parentId = req.user.userId;  // JWT 토큰에서 추출한 부모 ID
    const { name, age, gender } = createChildDto;

    const code = await this.parentService.registerChild(parentId, name, age, gender);
    return { code };
  }

  @Get('/child')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get list of children' })
  async getChildList(@Request() req): Promise<{ childList: Child[] }> {
    const parentId = req.user.userId;  // JWT 토큰에서 추출한 부모 ID
    const childList = await this.parentService.getChildList(parentId);
    return { childList };
  }

  @Get('/child/:childId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '특정 아이의 정보와 결과 리스트 조회' })
  async getChildDetails(@Param('childId') childId: string) {
    const childDetails = await this.parentService.getChildDetails(parseInt(childId));
    return childDetails;
  }

  @Get('/survey/:childId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '특정 자식의 설문조사 세부정보 조회' })
  async getSurveyDetails(
    @Param('childId') childId: string,
    @Request() req
  ): Promise<any> {
    const parentId = req.user.userId; // JWT 토큰에서 추출된 parentId

    // 해당 childId가 요청한 부모의 자식인지 확인하는 로직 추가
    await this.parentService.validateChildOwnership(parseInt(childId), parentId);

    const surveyDetails = await this.parentService.getSurveyDetailsForChild(parseInt(childId));
    return surveyDetails;
  }
  
  @Get('/survey/:surveyId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '특정 설문조사의 질문과 답변 조회' })
  async getSurveyAnswers(
    @Param('surveyId') surveyId: string,
    @Request() req
  ): Promise<any> {
    const parentId = req.user.userId; // JWT 토큰에서 추출된 parentId

    // surveyId로 childId를 확인하고, 자녀 소유권을 확인
    const childId = await this.parentService.getChildIdBySurveyId(parseInt(surveyId));
    await this.parentService.validateChildOwnership(childId, parentId);

    const answerList = await this.parentService.getSurveyAnswers(parseInt(surveyId));
    return answerList;
  }
}
