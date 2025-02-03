import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Favorites')
@Controller('favorites')
@UseInterceptors(ApiResponseInterceptor)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Auth()
  create(@Body() favoriteDto: FavoriteDto, @GetUser() user: User) {
    return this.favoritesService.toggleFavorite(favoriteDto, user);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.favoritesService.findAll(user);
  }
}
