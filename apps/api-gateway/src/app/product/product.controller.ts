import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateProductDto, UpdateProductDto } from "@inventory-system/dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@UseGuards(AuthGuard)
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: { sub: string }) {
    // const userId = req.user.sub;
    return this.productService.create(createProductDto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.productService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.productService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: { sub: string }) {
    return this.productService.update(id, updateProductDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.productService.remove(id, user.sub);
  }
}
