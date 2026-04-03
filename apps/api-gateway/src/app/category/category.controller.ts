import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch, Delete } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateCategoryDto, UpdateCategoryDto } from "@inventory-system/dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@UseGuards(AuthGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.create(user.sub, createCategoryDto);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.categoryService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.update(id, updateCategoryDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.remove(id, user.sub);
  }
}
