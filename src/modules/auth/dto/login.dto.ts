import { ApiProperty } from '@nestjs/swagger';
export class LoginRequest {
    @ApiProperty({ description: 'Indicates whether the user is a parent', example: true })
    isParent: boolean;

    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    email: string;

    @ApiProperty({ 
        description: 'The password of the user (required if isParent is true)', 
        example: 'password123',
        required: false 
    })
    password?: string;
    
    @ApiProperty({ 
        description: 'The code of the child (required if isParent is false)', 
        example: 'childCode123',
        required: false 
    })
    code?: string;
}
  
export class LoginResponse {
    accessToken: string;
}