import { Controller } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';


@Controller()
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) { }

  // @MessagePattern('createStockMovement')
  // create(@Payload() createStockMovementDto: CreateStockMovementDto) {
  //   return this.stockMovementService.create(createStockMovementDto);
  // }

  // @MessagePattern('findAllStockMovement')
  // findAll() {
  //   return this.stockMovementService.findAll();
  // }

  // @MessagePattern('findOneStockMovement')
  // findOne(@Payload() id: number) {
  //   return this.stockMovementService.findOne(id);
  // }

  // @MessagePattern('updateStockMovement')
  // update(@Payload() updateStockMovementDto: UpdateStockMovementDto) {
  //   return this.stockMovementService.update(updateStockMovementDto.id, updateStockMovementDto);
  // }

  // @MessagePattern('removeStockMovement')
  // remove(@Payload() id: number) {
  //   return this.stockMovementService.remove(id);
  // }
}
