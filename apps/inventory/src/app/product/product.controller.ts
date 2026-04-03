import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { PRODUCT_CMD } from '@inventory-system/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from '@inventory-system/dto';


@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern(PRODUCT_CMD.CREATE)
  create(@Payload() payload: { createProductDto: CreateProductDto, userId: string }) {
    return this.productService.create(payload.createProductDto, payload.userId);
  }

  @MessagePattern(PRODUCT_CMD.FIND)
  findAll(@Payload() userId: string) {
    return this.productService.findAll(userId);
  }

  @MessagePattern(PRODUCT_CMD.FIND_ONE)
  findOne(@Payload() payload: { id: string, userId: string }) {
    const { id, userId } = payload
    return this.productService.findOne(id, userId);
  }

  @MessagePattern(PRODUCT_CMD.UPDATE)
  update(@Payload() payload: { id: string, updateProductDto: CreateProductDto, userId: string }) {
    return this.productService.update(payload.id, payload.updateProductDto, payload.userId);
  }

  @MessagePattern(PRODUCT_CMD.DELETE)
  remove(@Payload() payload: { id: string, userId: string }) {
    return this.productService.remove(payload.id, payload.userId);
  }
}
