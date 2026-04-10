import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateProductDto, UpdateProductDto } from "@inventory-system/dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductResponseDto } from '@inventory-system/dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created', type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid product data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: { sub: string }) {
    return this.productService.create(createProductDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({ description: 'Products retrieved', type: [ProductResponseDto] })
  @ApiNotFoundResponse({ description: 'No products found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }) {
    return this.productService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Product found', type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.productService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: 'uuid' })
  @ApiOkResponse({ description: 'Product updated', type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: { sub: string }) {
    return this.productService.update(id, updateProductDto, user.sub);
  }

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



// import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
// import { ProductService } from "./product.service";
// import { AuthGuard } from "../guards/auth.guard";
// import { CreateProductDto, UpdateProductDto } from "@inventory-system/dto";
// import { CurrentUser } from "../common/decorators/current-user.decorator";

// @UseGuards(AuthGuard)
// @Controller("product")
// export class ProductController {
//   constructor(private readonly productService: ProductService) { }

//   @Post()
//   async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: { sub: string }) {
//     // const userId = req.user.sub;
//     return this.productService.create(createProductDto, user.sub);
//   }

//   @Get()
//   findAll(@CurrentUser() user: { sub: string }) {
//     return this.productService.findAll(user.sub);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
//     return this.productService.findOne(id, user.sub);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: { sub: string }) {
//     return this.productService.update(id, updateProductDto, user.sub);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
//     return this.productService.remove(id, user.sub);
//   }
// }
