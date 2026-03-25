
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/product_db'),
    ProductModule,
  ],
})
export class AppModule {}
