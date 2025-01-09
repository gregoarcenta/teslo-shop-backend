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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth, GetUser } from '../auth/decorators';
import { CartProductDto } from './dto/cart-product.dto';
import { ValidateCartAndProductGuard } from '../common/guards/validate-cart-and-product/validate-cart-and-product.guard';

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
  updateQuantity(@Param('id') id: string) {
    return this.cartService.updateProductQuantity(+id);
  }

  @Delete('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  removeProductsFromCart(@Body() @Body() cartProductDto: CartProductDto) {
    return this.cartService.removeProductsFromCart(cartProductDto);
  }
}
