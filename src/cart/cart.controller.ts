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
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth } from '../auth/decorators';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { ValidateCartAndProductGuard } from '../common/guards/validate-cart-and-product/validate-cart-and-product.guard';

@ApiTags('Cart')
@Controller('cart')
@UseInterceptors(ApiResponseInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('item')
  @UseGuards(ValidateCartAndProductGuard)
  @Auth()
  addProductToCart(@Body() addProductToCartDto: AddProductToCartDto) {
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
