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
import { ValidateCartAndProductGuard } from '../common/guards/validate-cart-and-product/validate-cart-and-product.guard';
import { CartProductDto, CartProductUpdateDto } from './dto';
import {
  ApiAddProductToCartResponse,
  ApiClearCartResponse,
  ApiGetCartResponse,
  ApiRemoveProductFromCartResponse,
  ApiUpdateQuantityResponse,
} from '../swagger/decorators/cart';

@ApiTags('Cart')
@Controller('cart')
@UseInterceptors(ApiResponseInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth()
  @ApiGetCartResponse()
  getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete()
  @Auth()
  @ApiClearCartResponse()
  clearCart(@GetUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Post('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  @ApiAddProductToCartResponse()
  addProductToCart(@Body() cartProductDto: CartProductDto) {
    return this.cartService.addProductToCart(cartProductDto);
  }

  @Patch('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  @ApiUpdateQuantityResponse()
  updateQuantity(@Body() cartProductUpdateDto: CartProductUpdateDto) {
    return this.cartService.updateProductQuantity(cartProductUpdateDto);
  }

  @Delete('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  @ApiRemoveProductFromCartResponse()
  removeProductFromCart(@Body() @Body() cartProductDto: CartProductDto) {
    return this.cartService.removeProductFromCart(cartProductDto);
  }
}
