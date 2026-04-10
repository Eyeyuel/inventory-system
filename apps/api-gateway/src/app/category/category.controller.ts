import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from "@inventory-system/dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { CategoryService } from "./category.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiOperation({ summary: 'Create a new category.' })
  @ApiCreatedResponse({ description: 'Category created', type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid category data' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.create(user.sub, createCategoryDto);
  }

  @ApiOperation({ summary: 'List all category.' })
  @ApiOkResponse({ description: 'Category retrieved', type: [CategoryResponseDto] })
  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.categoryService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Category found', type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'a category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'a category updated', type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.update(id, updateCategoryDto, user.sub);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'category deleted', type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'category not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.remove(id, user.sub);
  }
}
