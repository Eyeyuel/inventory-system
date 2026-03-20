import { CreateCategoryDto } from '@inventory-system/dto';
import { Injectable } from '@nestjs/common';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}
    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const newCategory = this.categoryRepository.create(createCategoryDto);
            return this.categoryRepository.save(newCategory);
        } catch (error) {
            throw new RpcException({
                statusCode: 500,
                message: "Database error while saving category",
            });
        }
    }
}
