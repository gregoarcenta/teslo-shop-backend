import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderPaginationDto, UpdateOrderDto } from './dto';

import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import {
  ApiCreateResponse,
  ApiFindAllByUserResponse,
  ApiFindAllResponse,
  ApiFindOneResponse,
  ApiUpdateResponse,
} from '../swagger/decorators/orders';
import { Role } from '../config';
import { Auth, GetUser } from '../modules/auth/decorators';
import { User } from '../modules/auth/entities/user.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  @ApiCreateResponse()
  create(@GetUser() user: User) {
    return this.ordersService.create(user);
  }

  @Get()
  @Auth(Role.ADMIN)
  @ApiFindAllResponse()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @Get('user')
  @Auth()
  @ApiFindAllByUserResponse()
  findAllByUser(
    @Query() orderPaginationDto: OrderPaginationDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.findAllByUser(orderPaginationDto, user);
  }

  @Get(':id')
  @Auth()
  @ApiFindOneResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiUpdateResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
