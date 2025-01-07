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
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
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
import { CreateProductDto, PaginateProductDto, UpdateProductDto } from './dto';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(ApiResponseInterceptor)
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
