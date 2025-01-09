import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth, GetUser } from '../auth/decorators';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { ValidateCartAndProductGuard } from '../common/guards/validate-cart-and-product/validate-cart-and-product.guard';
import { User } from '../auth/entities/user.entity';

@ApiTags('Cart')
@Controller('cart')
@UseInterceptors(ApiResponseInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth()
  getCart(@GetUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Delete()
  clearCart(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }

  @Post('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  addProductToCart(@Body() addProductToCartDto: AddProductToCartDto) {
    return this.cartService.addProductToCart(addProductToCartDto);
  }

  @Patch('item')
  updateQuantity(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Delete('item')
  decreaseQuantity(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Delete('item')
  removeProductFromCart(
    @Param('id') id: string,
    @Body() updateCartDto: CartResponseDto,
  ) {
    return this.cartService.update(+id, updateCartDto);
  }
}
