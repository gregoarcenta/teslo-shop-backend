import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, GetUser } from '../auth/decorators';
import { Role } from '../config';
import { User } from '../auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateResponse,
  ApiFindAllResponse,
  ApiFindOneResponse,
  ApiRemoveResponse,
  ApiUpdateResponse,
} from '../swagger/decorators/products';
import { PaginateProductDto } from './dto/paginate-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiCreateResponse()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiFindAllResponse()
  findAll(@Query() paginate: PaginateProductDto) {
    return this.productsService.findAll(paginate);
  }

  @Get(':term')
  @ApiFindOneResponse()
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiUpdateResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiRemoveResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
