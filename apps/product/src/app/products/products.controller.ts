import { Controller } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateProductDto } from "@inventory-system/dto";
import { PRODUCT_CMD } from "@inventory-system/constants";

@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @MessagePattern(PRODUCT_CMD.CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  //   @MessagePattern(PRODUCT_CMD.GET_ALL)
  //   findAll() {
  //     return this.productService.findAll();
  //   }

  //   @MessagePattern(PRODUCT_CMD.GET_ONE)
  //   findOne(id: number) {
  //     return this.productService.findOne(id);
  //   }
}
