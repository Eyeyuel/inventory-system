import { CreateProductDto } from "@inventory-system/dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {}
}
