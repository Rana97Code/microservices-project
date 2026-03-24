import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private getToken(req) {
    return req.headers.authorization?.replace('Bearer ', '');
  }

  @Post()
  @ApiBody({ type: CreateProductDto })
  create(@Body() dto: CreateProductDto, @Req() req) {
    return this.productService.create(dto, this.getToken(req));
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req) {
    return this.productService.update(id, dto, this.getToken(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.productService.delete(id, this.getToken(req));
  }
}