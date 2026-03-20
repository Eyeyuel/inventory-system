import { CreateProductDto } from "@inventory-system/dto";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      return this.productRepository.save(newProduct);
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: "Database error while saving product",
      });
    }
  }
}
