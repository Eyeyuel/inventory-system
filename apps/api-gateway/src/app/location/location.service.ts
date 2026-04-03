import { LOCATION_CMD } from '@inventory-system/constants';
import { CreateLocationDto, UpdateLocationDto } from '@inventory-system/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LocationService {
  constructor(
    @Inject("INVENTORY_SERVICE") private readonly productClient: ClientProxy,
  ) { }
  create(createLocationDto: CreateLocationDto, userId: string) {
    return this.productClient.send(LOCATION_CMD.CREATE, { createLocationDto, userId })
  }

  findAll(userId: string) {
    return this.productClient.send(LOCATION_CMD.FIND, userId)
  }

  findOne(id: string, userId: string) {
    return this.productClient.send(LOCATION_CMD.FIND_ONE, { id, userId })
  }

  update(id: string, updateLocationDto: UpdateLocationDto, userId: string) {
    return this.productClient.send(LOCATION_CMD.UPDATE, { id, updateLocationDto, userId })
  }

  remove(id: string, userId: string) {
    return this.productClient.send(LOCATION_CMD.DELETE, { id, userId })
  }
}
