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
import { Auth, GetUser } from '../auth/decorators';
import { OrderPaginationDto, UpdateOrderDto } from './dto';
import { User } from '../auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import {
  ApiCreateResponse,
  ApiFindAllByUserResponse,
  ApiFindAllResponse,
  ApiFindOneResponse,
  ApiUpdateResponse,
} from '../swagger/decorators/orders';

@ApiTags('Orders')
@UseInterceptors(ApiResponseInterceptor)
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
  @Auth()
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
  @Auth()
  @ApiUpdateResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
