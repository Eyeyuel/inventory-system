import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';


@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // @MessagePattern('createLocation')
  // create(@Payload() createLocationDto: CreateLocationDto) {
  //   return this.locationService.create(createLocationDto);
  // }

  // @MessagePattern('findAllLocation')
  // findAll() {
  //   return this.locationService.findAll();
  // }

  // @MessagePattern('findOneLocation')
  // findOne(@Payload() id: number) {
  //   return this.locationService.findOne(id);
  // }

  // @MessagePattern('updateLocation')
  // update(@Payload() updateLocationDto: UpdateLocationDto) {
  //   return this.locationService.update(updateLocationDto.id, updateLocationDto);
  // }

  // @MessagePattern('removeLocation')
  // remove(@Payload() id: number) {
  //   return this.locationService.remove(id);
  // }
}
