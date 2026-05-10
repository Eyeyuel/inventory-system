import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  CreateLocationDto,
  FindLocationsDto,
  LocationResponseDto,
  PaginatedLocationResponseDto,
  UpdateLocationDto,
} from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Throttle({ [THROTTLE_PRESETS.location.name]: THROTTLE_PRESETS.location })
  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiCreatedResponse({ description: 'location created', type: LocationResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid location data' })
  create(@Body() createLocationDto: CreateLocationDto, @CurrentUser() user: { sub: string }) {
    return this.locationService.create(createLocationDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.location.name]: THROTTLE_PRESETS.location })
  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiOkResponse({ description: 'Locations retrieved', type: PaginatedLocationResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Query() filters: FindLocationsDto, @CurrentUser() user: { sub: string }) {
    return this.locationService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.location.name]: THROTTLE_PRESETS.location })
  @Get(':id')
  @ApiOperation({ summary: 'Get a location by id' })
  @ApiParam({ name: 'id', type: String, example: 'uuid' })
  @ApiOkResponse({ description: 'location found', type: LocationResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid location id' })
  @ApiNotFoundResponse({ description: 'location not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.locationService.findOne(id, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.location.name]: THROTTLE_PRESETS.location })
  @ApiOperation({ summary: 'Update a location by id' })
  @ApiParam({ name: 'id', type: String, example: 'uuid' })
  @ApiOkResponse({ description: 'location updated', type: LocationResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiNotFoundResponse({ description: 'location not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.locationService.update(id, updateLocationDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.location.name]: THROTTLE_PRESETS.location })
  @ApiOperation({ summary: 'Delete a location by id' })
  @ApiParam({ name: 'id', type: String, example: 'uuid' })
  @ApiOkResponse({ description: 'location deleted' })
  @ApiNotFoundResponse({ description: 'location not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.locationService.remove(id, user.sub);
  }
}
