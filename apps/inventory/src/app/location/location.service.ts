import { CreateLocationDto, UpdateLocationDto } from '@inventory-system/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@inventory-system/entities';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private readonly locationRepository: Repository<Location>) { }
  async create(createLocationDto: CreateLocationDto, userId: string) {
    try {
      // maybe look for the user if the user existes or not???
      const location = await this.locationRepository.create({ ...createLocationDto, user: userId })
      return this.locationRepository.save(location)
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: "Database error while createing location",
      })
    }
  }

  async findAll(userId: string) {
    try {
      const locations = await this.locationRepository.find({ where: { user: userId } })
      if (!locations) {
        throw new RpcException({
          statusCode: 404,
          message: "User Does not have locations."
        }
        )
      }
      return locations;
    } catch (error) {
      handleRpcException(error, "Database error while getting locations");
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const location = await this.locationRepository.findOne({ where: { id, user: userId } })
      if (!location) {
        throw new RpcException({
          statusCode: 404,
          message: "user does not have a location with that id."
        })
      }
      return location;
    } catch (error) {
      handleRpcException(error, "Database error while getting single location");
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto, userId: string) {
    try {
      const location = await this.locationRepository.findOne({ where: { id, user: userId } })
      if (!location) {
        throw new RpcException({
          statusCode: 404,
          message: "user does not have a location with that id."
        })
      }

      const newLocation = this.locationRepository.merge(location, updateLocationDto)

      return await this.locationRepository.save(newLocation)
    } catch (error) {
      handleRpcException(error, "Database error while updating location");
    }
  }

  async remove(id: string, userId: string) {
    try {
      const result = await this.locationRepository.softDelete({ id, user: userId });
      if (result.affected === 0) throw new RpcException({
        statusCode: 404,
        message: "user does not have a location with that id."
      })
      return result;
    } catch (error) {
      handleRpcException(error, "Database error while deleting location");
    }
  }
}
