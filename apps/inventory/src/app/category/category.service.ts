import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@inventory-system/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '@inventory-system/dto';
import { RpcException } from '@nestjs/microservices';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) { }
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: createCategoryDto.name,
          user: userId
        }
      })
      if (existingCategory) {
        throw new RpcException({
          statusCode: 400,
          message: "Category already exists",
        })
      }
      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        user: userId
      })
      const result = await this.categoryRepository.save(newCategory);
      return result;
    } catch (error) {
      handleRpcException(error, "Database error while creating category");
    }
  }

  async findAll(userId: string) {
    try {
      const categories = await this.categoryRepository.find({
        where: {
          user: userId
        },
        // relations: ["products"] // to get products[] of every category
      })
      if (!categories) {
        throw new RpcException({
          statusCode: 404,
          message: "Categories not found",
        })
      }
      return categories;
    } catch (error) {
      handleRpcException(error, "Database error while getting categories");
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: id,
          user: userId
        }
      })
      if (!category) {
        throw new RpcException({
          statusCode: 404,
          message: "Category not found",
        })
      }
      return category;
    } catch (error) {
      handleRpcException(error, "Database error while getting single category");
    }
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: id,
          user: userId
        }
      })
      if (!category) {
        throw new RpcException({
          statusCode: 404,
          message: "Category not found",
        })
      }
      const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto)
      return this.categoryRepository.save(updatedCategory).then((result) => {
        return result;
      })
    } catch (error) {
      handleRpcException(error, "Database error while updating category");
    }
  }

  async remove(id: string, userId: string) {
    try {
      const result = await this.categoryRepository.softDelete({ id, user: userId });
      if (result.affected === 0) throw new RpcException({
        statusCode: 404,
        message: "user does not have a category with that id."
      })
      return result;
    } catch (error) {
      handleRpcException(error, "Database error while deleting category");
    }
  }
}


