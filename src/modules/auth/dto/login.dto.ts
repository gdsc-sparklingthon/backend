import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty()
  isParent: boolean;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password?: string; // isParent가 true일 때만 필요
  @ApiProperty()
  code?: string; // isParent가 false일 때만 필요
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
}
