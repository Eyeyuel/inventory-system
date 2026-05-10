import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@inventory-system/entities';
import { CreateCategoryDto, FindCategoriesDto, UpdateCategoryDto } from '@inventory-system/dto';
import { RpcException } from '@nestjs/microservices';
import { handleRpcException } from '@inventory-system/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  LIST_TTL = 6 * 60 * 60 * 1000; // 6 hours
  SINGLE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  VERSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // ----- Helper methods for versioning -----
  // Gets the current version number for this user's category list caches.
  // If no version is stored, returns 1 (initial version).
  private async getVersion(userId: string): Promise<number> {
    const version = await this.cache.get<number>(`categories:version:${userId}`);
    return version ?? 1;
  }

  // Increments the version number for this user.
  // By using a timestamp, we guarantee a new unique version.
  // Old keys with previous version become obsolete.
  private async bumpVersion(userId: string): Promise<void> {
    const newVersion = Date.now(); // or increment a number
    await this.cache.set(`categories:version:${userId}`, newVersion, this.VERSION_TTL);
  }

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name, user: userId },
      });
      if (existingCategory) {
        throw new RpcException({ statusCode: 400, message: 'Category already exists' });
      }
      const newCategory = this.categoryRepository.create({ ...createCategoryDto, user: userId });
      const result = await this.categoryRepository.save(newCategory);

      // After creating a new category, increase the version so that all list caches become stale.
      await this.bumpVersion(userId);

      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while creating category');
    }
  }

  async findAll(filters: FindCategoriesDto, userId: string) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search } = filters;

      // 1. Get current version number
      const version = await this.getVersion(userId);

      // 2. Build cache key including version and normalized filters
      const key = `categories:${userId}:v${version}:${JSON.stringify(filters)}`;
      console.log('CACHE KEY:', key);
      const cached = await this.cache.get(key);
      console.log('CACHE HIT:', !!cached);
      if (cached) return cached;

      // 3. Database query (same as before)
      const queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .where('category.user = :userId', { userId });
      if (search) {
        queryBuilder.andWhere(
          '(category.name ILIKE :search OR category.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }
      const [data, total] = await queryBuilder
        .orderBy(`category.${sortBy}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const result = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      // 4. Store in cache with TTL (e.g., 60 seconds)
      await this.cache.set(key, result, this.LIST_TTL); // TTL 6 hours
      console.log('CACHE SET:', true);
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while fetching categories');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const key = `category:${userId}:${id}`;

      const cached = await this.cache.get(key);
      if (cached) return cached;

      const category = await this.categoryRepository.findOne({
        where: { id, user: userId },
      });

      if (!category) {
        throw new RpcException({ statusCode: 404, message: 'Category not found' });
      }

      // Store in cache (Redis)
      await this.cache.set(key, category, this.SINGLE_TTL); // TTL 24 hours

      return category;
    } catch (error) {
      handleRpcException(error, 'Database error while getting single category');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id, user: userId } });
      if (!category) {
        throw new RpcException({ statusCode: 404, message: 'Category not found' });
      }
      const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
      const result = await this.categoryRepository.save(updatedCategory);

      // After update, increment version to invalidate list caches.
      await this.bumpVersion(userId);
      // Also delete the single item cache for this category.
      await this.cache.del(`category:${userId}:${id}`);

      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while updating category');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const result = await this.categoryRepository.softDelete({ id, user: userId });
      if (result.affected === 0) {
        throw new RpcException({
          statusCode: 404,
          message: 'user does not have a category with that id.',
        });
      }

      // After delete, bump version to invalidate list caches.
      await this.bumpVersion(userId);
      // Also delete the single item cache.
      await this.cache.del(`category:${userId}:${id}`);

      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while deleting category');
    }
  }
}

// import { Inject, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Category } from '@inventory-system/entities';
// import { CreateCategoryDto, FindCategoriesDto, UpdateCategoryDto } from '@inventory-system/dto';
// import { RpcException } from '@nestjs/microservices';
// import { handleRpcException } from '@inventory-system/constants';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import type { Cache } from 'cache-manager';

// @Injectable()
// export class CategoryService {
//   constructor(
//     @InjectRepository(Category) private categoryRepository: Repository<Category>,
//     @Inject(CACHE_MANAGER)
//     private cache: Cache,
//   ) {}
//   async create(userId: string, createCategoryDto: CreateCategoryDto) {
//     try {
//       const existingCategory = await this.categoryRepository.findOne({
//         where: {
//           name: createCategoryDto.name,
//           user: userId,
//         },
//       });
//       if (existingCategory) {
//         throw new RpcException({
//           statusCode: 400,
//           message: 'Category already exists',
//         });
//       }
//       const newCategory = this.categoryRepository.create({
//         ...createCategoryDto,
//         user: userId,
//       });
//       const result = await this.categoryRepository.save(newCategory);
//       return result;
//     } catch (error) {
//       handleRpcException(error, 'Database error while creating category');
//     }
//   }

//   // category.service.ts
//   async findAll(filters: FindCategoriesDto, userId: string) {
//     try {
//       const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search } = filters;

//       const key = `categories:${userId}:${JSON.stringify(filters)}`;
//       // Check cache first
//       const cached = await this.cache.get(key);
//       console.log('CACHE KEY:', key);
//       console.log('CACHE HIT:', !!cached);
//       if (cached) return cached;

//       const queryBuilder = this.categoryRepository
//         .createQueryBuilder('category')
//         .where('category.user = :userId', { userId });

//       if (search) {
//         queryBuilder.andWhere(
//           '(category.name ILIKE :search OR category.description ILIKE :search)',
//           { search: `%${search}%` },
//         );
//       }

//       const [data, total] = await queryBuilder
//         .orderBy(`category.${sortBy}`, sortOrder)
//         .skip((page - 1) * limit)
//         .take(limit)
//         .getManyAndCount();

//       const result = {
//         data,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };

//       // 3. store in cache (e.g. 60 seconds)
//       await this.cache.set(key, result, 60_000);
//       console.log('CACHE SET:', !!cached);

//       return result;
//     } catch (error) {
//       handleRpcException(error, 'Database error while fetching categories');
//     }
//   }
//   // async findAll(userId: string) {
//   //   try {
//   //     const categories = await this.categoryRepository.find({
//   //       where: {
//   //         user: userId
//   //       },
//   //       // relations: ["products"] // to get products[] of every category
//   //     })
//   //     if (!categories) {
//   //       throw new RpcException({
//   //         statusCode: 404,
//   //         message: "Categories not found",
//   //       })
//   //     }
//   //     return categories;
//   //   } catch (error) {
//   //     handleRpcException(error, "Database error while getting categories");
//   //   }
//   // }

//   async findOne(id: string, userId: string) {
//     try {
//       const category = await this.categoryRepository.findOne({
//         where: {
//           id: id,
//           user: userId,
//         },
//       });
//       if (!category) {
//         throw new RpcException({
//           statusCode: 404,
//           message: 'Category not found',
//         });
//       }
//       return category;
//     } catch (error) {
//       handleRpcException(error, 'Database error while getting single category');
//     }
//   }
//   async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
//     try {
//       const category = await this.categoryRepository.findOne({
//         where: {
//           id: id,
//           user: userId,
//         },
//       });
//       if (!category) {
//         throw new RpcException({
//           statusCode: 404,
//           message: 'Category not found',
//         });
//       }
//       const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
//       return this.categoryRepository.save(updatedCategory).then((result) => {
//         return result;
//       });
//     } catch (error) {
//       handleRpcException(error, 'Database error while updating category');
//     }
//   }

//   async remove(id: string, userId: string) {
//     try {
//       const result = await this.categoryRepository.softDelete({ id, user: userId });
//       if (result.affected === 0)
//         throw new RpcException({
//           statusCode: 404,
//           message: 'user does not have a category with that id.',
//         });
//       return result;
//     } catch (error) {
//       handleRpcException(error, 'Database error while deleting category');
//     }
//   }
// }
