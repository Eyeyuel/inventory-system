import { CATEGORY_CMD } from '@inventory-system/constants';
import { CreateCategoryDto, FindCategoriesDto, UpdateCategoryDto } from '@inventory-system/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(@Inject('INVENTORY_SERVICE') private readonly categoryClient: ClientProxy) {}
  create(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.categoryClient.send(CATEGORY_CMD.CREATE, { userId, createCategoryDto });
  }

  findAll(filters: FindCategoriesDto, userId: string) {
    return this.categoryClient.send(CATEGORY_CMD.FIND, { filters, userId });
  }

  findOne(id: string, userId: string) {
    return this.categoryClient.send(CATEGORY_CMD.FIND_ONE, { id, userId });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    return this.categoryClient.send(CATEGORY_CMD.UPDATE, { id, updateCategoryDto, userId });
  }

  remove(id: string, userId: string) {
    return this.categoryClient.send(CATEGORY_CMD.DELETE, { id, userId });
  }
}
