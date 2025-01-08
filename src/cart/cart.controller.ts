import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth, GetUser } from '../auth/decorators';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { User } from '../auth/entities/user.entity';

@ApiTags('Cart')
@Controller('cart')
@UseInterceptors(ApiResponseInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('item')
  @Auth()
  addProductToCart(
    @Body() addProductToCartDto: AddProductToCartDto,
    @GetUser() user: User,
  ) {
    return this.cartService.addProductToCart(addProductToCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
