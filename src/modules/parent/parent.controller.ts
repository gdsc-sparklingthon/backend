import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateChildDto } from './dto/create-child.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('parents')
@Controller('parents')
export class ParentController {
  constructor(private readonly parentsService: ParentService) {}

  @Post('/child')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '자식 등록 API' })
  async registerChild(
    @Body() createChildDto: CreateChildDto,
    @Request() req,
  ): Promise<{ code: string }> {
    const parentId = req.user.userId;  // JWT 토큰에서 추출한 부모 ID
    const { name, age, gender } = createChildDto;

    const code = await this.parentsService.registerChild(parentId, name, age, gender);
    return { code };
  }
}
