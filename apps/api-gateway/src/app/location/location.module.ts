import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { InventoryClientModule } from '../clients/inventory.client.module';

@Module({
  imports: [InventoryClientModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule { }
