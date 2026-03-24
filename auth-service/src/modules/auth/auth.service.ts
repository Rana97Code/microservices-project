import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, RmqOptions } from '@nestjs/microservices';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

    private rmqClient: ClientProxy;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    
  this.rmqClient = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL!],
    queue: 'auth_events',
    queueOptions: { durable: false },
  },
} as RmqOptions);
  }

generateTokens(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
  });

  const refreshToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || '7d') as any,
  });

  return { accessToken, refreshToken };
}

async refreshToken(token: string) {
  try {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userService.findById(decoded.id);
    if (!user) throw new BadRequestException('User not found');

    return {
      message: 'New tokens generated',
      ...this.generateTokens(user),
    };

  } catch (e) {
    throw new BadRequestException('Invalid refresh token');
  }
}

async validateToken(token: string) {
  try {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: 'Invalid or expired token' };
  }
}



  // REGISTER
 async register(dto) {
  const userExists = await this.userService.findByEmail(dto.email);
  if (userExists) throw new BadRequestException('Email already exists');

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.userService.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
  });

  // publish event
  this.rmqClient.emit('user.created', {
    id: user._id,
    email: user.email,
    name: user.name,
  });

  return { message: 'User registered', user };
}



//   // LOGIN
//   async login(dto) {
//     const user = await this.userService.findByEmail(dto.email);
//     if (!user) throw new BadRequestException('Invalid email/password');

//     const match = await bcrypt.compare(dto.password, user.password);
//     if (!match) throw new BadRequestException('Invalid email/password');

//     // TODO: generate JWT access + refresh tokens

//     return { message: 'Login successful', user };
//   }

async login(dto) {
  const user = await this.userService.findByEmail(dto.email);
  if (!user) throw new BadRequestException('Invalid email/password');

  const match = await bcrypt.compare(dto.password, user.password);
  if (!match) throw new BadRequestException('Invalid email/password');

  const tokens = this.generateTokens(user);

  return {
    message: 'Login successful',
    user,
    ...tokens,
  };
}
}