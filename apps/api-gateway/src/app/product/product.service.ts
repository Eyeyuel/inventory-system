import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PRODUCT_CMD } from "@inventory-system/constants";
import { CreateProductDto } from "@inventory-system/dto";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCT_SERVICE") private readonly productClient: ClientProxy,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productClient.send(
      PRODUCT_CMD.CREATE,
      createProductDto,
    );
    return product;
  }

  findAll() {
    return this.productClient.send(PRODUCT_CMD.FIND, {});
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
