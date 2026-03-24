import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Product } from './product.model';
import * as typegoose from '@typegoose/typegoose';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typegoose.ReturnModelType<typeof Product>,

    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {}

  // Validate user token via rabbitmq
  async validateUser(token: string) {
    const response = await this.authClient
      .send('auth.validate-token', { token })
      .toPromise();

    if (!response.valid) throw new UnauthorizedException('Invalid token');
    return response.decoded;
  }

  async create(dto, token: string) {
    const user = await this.validateUser(token);

    return this.productModel.create({
      ...dto,
      userId: user.id,
    });
  }

  async update(id: string, dto, token: string) {
    const user = await this.validateUser(token);

    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    if (product.userId !== user.id)
      throw new UnauthorizedException('Not your product');

    return this.productModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string, token: string) {
    const user = await this.validateUser(token);

    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    if (product.userId !== user.id)
      throw new UnauthorizedException('Not your product');

    return this.productModel.findByIdAndDelete(id);
  }

  findAll() {
    return this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }
}