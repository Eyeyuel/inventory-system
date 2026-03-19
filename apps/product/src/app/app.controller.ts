import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { MessagePattern } from "@nestjs/microservices";
import { PRODUCT_CMD } from "@inventory-system/constants";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(PRODUCT_CMD.FIND)
  getData() {
    return this.appService.getData();
  }
}
