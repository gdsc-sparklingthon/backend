import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

class RegisterDto {
    name: string;
    email: string;
    password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user')
  @ApiOperation({ summary: '회원가입 API' })
  async register(@Body() body: RegisterDto) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인 API' })
  async login(
    @Body(new ValidationPipe()) loginRequest: LoginRequest,
  ): Promise<LoginResponse> {
    return this.authService.login(loginRequest);
  }
}