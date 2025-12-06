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
import { Auth, GetUser, OptionalAuth } from '../modules/auth/decorators';
import { Role } from '../config';
import { User } from '../modules/auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateResponse,
  ApiFindAllResponse,
  ApiFindOneResponse,
  ApiRemoveResponse,
  ApiUpdateResponse,
} from '../swagger/decorators/products';
import { CreateProductDto, UpdateProductDto, ProductsFilterDto } from './dto';

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
  @OptionalAuth()
  @ApiFindAllResponse()
  findAll(
    @Query() filters: ProductsFilterDto,
    @GetUser('optional') user?: User,
  ) {
    return this.productsService.findAll(filters, user?.id);
  }

  @Get(':term')
  @OptionalAuth()
  @ApiFindOneResponse()
  findOne(@Param('term') term: string, @GetUser('optional') user?: User) {
    return this.productsService.findOne(term, user?.id);
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
