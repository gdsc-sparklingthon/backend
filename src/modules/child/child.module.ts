import { Global, Module } from '@nestjs/common';
import { GptService } from '../gpt/gpt.service';

@Global()
@Module({
  imports: [],
  providers: [GptService],
  exports: [],
})
export class ChildModule {}
