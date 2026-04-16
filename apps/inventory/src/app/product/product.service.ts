import { CreateProductDto, UpdateProductDto } from '@inventory-system/dto';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Product } from '@inventory-system/entities';
import { handleRpcException } from '@inventory-system/constants';


@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly categoryService: CategoryService) { }
  async create(createProductDto: CreateProductDto, userId: string) {
    try {
      const productData: Partial<Product> = { ...createProductDto, user: userId, category: undefined }
      if (createProductDto.categoryId) {
        const category = await this.categoryService.findOne(createProductDto.categoryId, userId);
        if (!category) throw new RpcException({ statusCode: 400, message: 'Category not found' });
        productData.category = category
      }
      // const product = this.productRepository.create({ ...createProductDto, user: userId });
      const product = this.productRepository.create(productData);
      return await this.productRepository.save(product);
    } catch (error) {
      handleRpcException(error, "Database error while creating product");
    }
  }

  async findAll(userId: string) {
    try {
      const products = await this.productRepository.find({
        where: {
          user: userId
        }, relations: ['category']
      })
      if (!products) {
        throw new RpcException({
          statusCode: 404,
          message: "Products not found",
        })
      }
      return products;
    } catch (error) {
      handleRpcException(error, "Database error while getting products");
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
          user: userId
        }, relations: { category: true, stocks: { location: true } },
        select: { category: { id: true, name: true }, stocks: { id: true, quantity: true, location: { id: true, name: true } } }
      })

      if (!product) {
        throw new RpcException({
          statusCode: 404,
          message: "Product not found",
        })
      }

      return product;
    } catch (error: unknown) {
      handleRpcException(error, "Database error while getting single product");
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
          user: userId
        },
        relations: ['category', 'stocks']
      })

      if (!product) {
        throw new RpcException({
          statusCode: 404,
          message: "Product not found",
        })
      }

      if (updateProductDto.categoryId) {
        const category = await this.categoryService.findOne(updateProductDto.categoryId, userId);
        if (!category) throw new RpcException({ statusCode: 400, message: 'Category not found' });
        product.category = category;
      }

      const updateProduct = this.productRepository.merge(product, updateProductDto)

      return await this.productRepository.save(updateProduct)

    } catch (error: unknown) {
      handleRpcException(error, 'Database error while updating product');
    }
  }


  async remove(id: string, userId: string) {
    try {
      const result = await this.productRepository.softDelete({
        id, user: userId
      })
      if (result.affected === 0) throw new RpcException({
        statusCode: 404,
        message: "Product not found"
      })
      return result;
    } catch (error) {
      handleRpcException(error, "Database error while deleting product");
    }
  }

}
