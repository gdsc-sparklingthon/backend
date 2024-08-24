import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@Controller('gpt')
@ApiTags('gpt')
export class GptController {}
