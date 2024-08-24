import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],  // AuthModule을 가져와서 JWT 인증을 사용할 수 있게 함
  controllers: [ProfileController],
})
export class ProfileModule {}
