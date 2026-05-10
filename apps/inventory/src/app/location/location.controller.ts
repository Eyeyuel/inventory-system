import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, FindLocationsDto, UpdateLocationDto } from '@inventory-system/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LOCATION_CMD } from '@inventory-system/constants';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @MessagePattern(LOCATION_CMD.CREATE)
  create(@Payload() payload: { createLocationDto: CreateLocationDto; userId: string }) {
    return this.locationService.create(payload.createLocationDto, payload.userId);
  }

  @MessagePattern(LOCATION_CMD.FIND)
  findAll(@Payload() payload: { filters: FindLocationsDto; userId: string }) {
    return this.locationService.findAll(payload.filters, payload.userId);
  }

  @MessagePattern(LOCATION_CMD.FIND_ONE)
  findOne(@Payload() payload: { id: string; userId: string }) {
    return this.locationService.findOne(payload.id, payload.userId);
  }

  @MessagePattern(LOCATION_CMD.UPDATE)
  update(@Payload() payload: { id: string; updateLocationDto: UpdateLocationDto; userId: string }) {
    return this.locationService.update(payload.id, payload.updateLocationDto, payload.userId);
  }

  @MessagePattern(LOCATION_CMD.DELETE)
  remove(@Payload() payload: { id: string; userId: string }) {
    return this.locationService.remove(payload.id, payload.userId);
  }
}
