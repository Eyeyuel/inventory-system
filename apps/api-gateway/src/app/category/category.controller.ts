import {
  CategoryResponseDto,
  CreateCategoryDto,
  FindCategoriesDto,
  PaginatedCategoryResponseDto,
  UpdateCategoryDto,
} from '@inventory-system/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CategoryService } from './category.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Throttle({ [THROTTLE_PRESETS.category.name]: THROTTLE_PRESETS.category })
  @Post()
  @ApiOperation({ summary: 'Create a new category.' })
  @ApiCreatedResponse({ description: 'Category created', type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid category data' })
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.create(user.sub, createCategoryDto);
  }

  @Throttle({ [THROTTLE_PRESETS.relaxed.name]: THROTTLE_PRESETS.relaxed })
  @Get()
  @ApiOperation({ summary: 'List all category.' })
  @ApiOkResponse({ description: 'Categories retrieved', type: PaginatedCategoryResponseDto })
  findAll(@Query() filters: FindCategoriesDto, @CurrentUser() user: { sub: string }) {
    return this.categoryService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.category.name]: THROTTLE_PRESETS.category })
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Category found', type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.findOne(id, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.category.name]: THROTTLE_PRESETS.category })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'a category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'a category updated', type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.categoryService.update(id, updateCategoryDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.category.name]: THROTTLE_PRESETS.category })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'category UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'category deleted', type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'category not found' })
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.categoryService.remove(id, user.sub);
  }
}
