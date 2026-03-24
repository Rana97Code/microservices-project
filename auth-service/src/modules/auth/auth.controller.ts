import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { MessagePattern } from '@nestjs/microservices';

import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  refresh(@Body('refresh_token') token: string) {
    return this.authService.refreshToken(token);
  }


@MessagePattern('auth.validate-token')
validateToken(data: { token: string }) {
  return this.authService.validateToken(data.token);
}


}