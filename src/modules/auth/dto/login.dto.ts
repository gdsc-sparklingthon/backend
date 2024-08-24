export class LoginRequest {
    isParent: boolean;
    email: string;
    password?: string; // isParent가 true일 때만 필요
    code?: string; // isParent가 false일 때만 필요
}
  
export class LoginResponse {
    accessToken: string;
}
