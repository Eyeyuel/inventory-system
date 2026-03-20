import { CATEGORY_CMD } from "@inventory-system/constants";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "@inventory-system/dto";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @MessagePattern(CATEGORY_CMD.CREATE)
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
