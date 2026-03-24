
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { UserModule } from './modules/user/user.module';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/auth'),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
