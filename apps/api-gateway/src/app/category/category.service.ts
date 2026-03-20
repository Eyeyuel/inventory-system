import { CATEGORY_CMD } from "@inventory-system/constants";
import { CreateCategoryDto } from "@inventory-system/dto";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class CategoryService {
  constructor(
    @Inject("PRODUCT_SERVICE") private readonly categoryClient: ClientProxy,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryClient.send(CATEGORY_CMD.CREATE, createCategoryDto);
    } catch (error) {
      // Log or transform, then rethrow
      console.error("Error calling category microservice:", error);
      throw error; // rethrow so global filter can handle
    }
  }
}
