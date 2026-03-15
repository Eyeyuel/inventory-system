import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getUsers(): { message: string } {
    return { message: "Users from user Microservice" };
  }
}
