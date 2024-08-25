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

  @Get('/child/recent')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '가장 최근에 답변한 자식 ID 조회' })
  async getMostRecentChildId(@Request() req): Promise<{ childId: number }> {
    console.log(req.user);
    const parentId = req.user.userId; // JWT 토큰에서 부모 ID 추출
    console.log(parentId);
    if (isNaN(parentId)) {
        throw new Error('Invalid parent ID');
    }
    console.log(parentId);
    const childId = await this.parentService.getMostRecentChildIdForParent(parentId);
    return { childId };   
  }
}
