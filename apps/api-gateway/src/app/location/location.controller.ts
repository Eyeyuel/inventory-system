import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post()
  create(@Body() createLocationDto: CreateLocationDto, @CurrentUser() user: { sub: string }) {
    return this.locationService.create(createLocationDto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.locationService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.locationService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto, @CurrentUser() user: { sub: string }) {
    return this.locationService.update(id, updateLocationDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.locationService.remove(id, user.sub);
  }
}
