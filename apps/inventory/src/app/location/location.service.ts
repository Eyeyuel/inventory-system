import { CreateLocationDto, FindLocationsDto, UpdateLocationDto } from '@inventory-system/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@inventory-system/entities';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
  ) {}
  async create(createLocationDto: CreateLocationDto, userId: string) {
    try {
      // maybe look for the user if the user existes or not???
      const location = await this.locationRepository.create({ ...createLocationDto, user: userId });
      return this.locationRepository.save(location);
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Database error while createing location',
      });
    }
  }

  // location.service.ts
  async findAll(filters: FindLocationsDto, userId: string) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search } = filters;

      const queryBuilder = this.locationRepository
        .createQueryBuilder('location')
        .where('location.user = :userId', { userId });

      if (search) {
        queryBuilder.andWhere(
          '(location.name ILIKE :search OR location.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [data, total] = await queryBuilder
        .orderBy(`location.${sortBy}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      handleRpcException(error, 'Database error while fetching locations');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const location = await this.locationRepository.findOne({ where: { id, user: userId } });
      if (!location) {
        throw new RpcException({
          statusCode: 404,
          message: 'user does not have a location with that id.',
        });
      }
      return location;
    } catch (error) {
      handleRpcException(error, 'Database error while getting single location');
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto, userId: string) {
    try {
      const location = await this.locationRepository.findOne({ where: { id, user: userId } });
      if (!location) {
        throw new RpcException({
          statusCode: 404,
          message: 'user does not have a location with that id.',
        });
      }

      const newLocation = this.locationRepository.merge(location, updateLocationDto);

      return await this.locationRepository.save(newLocation);
    } catch (error) {
      handleRpcException(error, 'Database error while updating location');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const result = await this.locationRepository.softDelete({ id, user: userId });
      if (result.affected === 0)
        throw new RpcException({
          statusCode: 404,
          message: 'user does not have a location with that id.',
        });
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while deleting location');
    }
  }
}
