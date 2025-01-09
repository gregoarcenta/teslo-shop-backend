import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth, GetUser } from '../auth/decorators';
import { CartProductDto } from './dto/cart-product.dto';
import { ValidateCartAndProductGuard } from '../common/guards/validate-cart-and-product/validate-cart-and-product.guard';
import { CartProductUpdateDto } from './dto/cart-product-update.dto';

@ApiTags('Cart')
@Controller('cart')
@UseInterceptors(ApiResponseInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth()
  getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete()
  @Auth()
  clearCart(@GetUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Post('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  addProductToCart(@Body() cartProductDto: CartProductDto) {
    return this.cartService.addProductToCart(cartProductDto);
  }

  @Patch('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  updateQuantity(@Body() cartProductUpdateDto: CartProductUpdateDto) {
    return this.cartService.updateProductQuantity(cartProductUpdateDto);
  }

  @Delete('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  removeProductsFromCart(@Body() @Body() cartProductDto: CartProductDto) {
    return this.cartService.removeProductsFromCart(cartProductDto);
  }
}
