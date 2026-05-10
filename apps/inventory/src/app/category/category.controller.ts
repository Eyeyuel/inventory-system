import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CATEGORY_CMD } from '@inventory-system/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto, FindCategoriesDto, UpdateCategoryDto } from '@inventory-system/dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(CATEGORY_CMD.CREATE)
  create(@Payload() payload: { userId: string; createCategoryDto: CreateCategoryDto }) {
    const { userId, createCategoryDto } = payload;
    return this.categoryService.create(userId, createCategoryDto);
  }

  @MessagePattern(CATEGORY_CMD.FIND)
  findAll(@Payload() payload: { filters: FindCategoriesDto; userId: string }) {
    return this.categoryService.findAll(payload.filters, payload.userId);
  }

  @MessagePattern(CATEGORY_CMD.FIND_ONE)
  findOne(@Payload() payload: { id: string; userId: string }) {
    return this.categoryService.findOne(payload.id, payload.userId);
  }

  @MessagePattern(CATEGORY_CMD.UPDATE)
  update(@Payload() payload: { id: string; updateCategoryDto: UpdateCategoryDto; userId: string }) {
    return this.categoryService.update(payload.id, payload.updateCategoryDto, payload.userId);
  }

  @MessagePattern(CATEGORY_CMD.DELETE)
  remove(@Payload() payload: { id: string; userId: string }) {
    return this.categoryService.remove(payload.id, payload.userId);
  }
}
