import {
  CreateProductDto,
  FindProductsDto,
  PaginatedProductResponseDto,
  ProductResponseDto,
  UpdateProductDto,
} from '@inventory-system/dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { THROTTLE_PRESETS } from '../common/throttle-presets';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Throttle({ [THROTTLE_PRESETS.product.write.name]: THROTTLE_PRESETS.product.write })
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created', type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid product data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.productService.create(createProductDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.product.read.name]: THROTTLE_PRESETS.product.read })
  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ type: FindProductsDto })
  @ApiOkResponse({ description: 'Products retrieved', type: PaginatedProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }, @Query() filters: FindProductsDto) {
    return this.productService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.product.read.name]: THROTTLE_PRESETS.product.read })
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Product found', type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.productService.findOne(id, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.product.write.name]: THROTTLE_PRESETS.product.write })
  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Product updated', type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.productService.update(id, updateProductDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.product.write.name]: THROTTLE_PRESETS.product.write })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Product deleted', type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.productService.remove(id, user.sub);
  }
}
