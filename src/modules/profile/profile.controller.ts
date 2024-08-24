import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    // req.user에는 JwtStrategy에서 반환된 사용자 정보가 담겨 있습니다.
    return req.user;
  }
}
