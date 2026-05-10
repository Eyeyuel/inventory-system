import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_CMD } from '@inventory-system/constants';
import { CreateProductDto, FindProductsDto, UpdateProductDto } from '@inventory-system/dto';

@Injectable()
export class ProductService {
  constructor(@Inject('INVENTORY_SERVICE') private readonly productClient: ClientProxy) {}

  create(createProductDto: CreateProductDto, userId: string) {
    const product = this.productClient.send(PRODUCT_CMD.CREATE, { createProductDto, userId });
    return product;
  }

  findAll(filters: FindProductsDto, userId: string) {
    return this.productClient.send(PRODUCT_CMD.FIND, { filters, userId });
  }

  findOne(id: string, userId: string) {
    return this.productClient.send(PRODUCT_CMD.FIND_ONE, { id, userId });
  }

  update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    return this.productClient.send(PRODUCT_CMD.UPDATE, { id, updateProductDto, userId });
  }

  remove(id: string, userId: string) {
    return this.productClient.send(PRODUCT_CMD.DELETE, { id, userId });
  }
}
