import { Injectable } from '@nestjs/common';
import { FavoriteDto } from './dto/favorite.dto';
import { User } from '../modules/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductResponseDto } from '../products/dto';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly handlerException: HandlerException,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async toggleFavorite(createFavoriteDto: FavoriteDto, user: User) {
    const { productId } = createFavoriteDto;

    try {
      const favorite = await this.favoriteRepository.findOne({
        where: { user, product: { id: productId } },
      });

      if (favorite) {
        await this.favoriteRepository.remove(favorite);
        return { message: 'Product has been removed from favorites' };
      }

      const newFavorite = this.favoriteRepository.create({
        user,
        product: { id: productId },
      });

      await this.favoriteRepository.save(newFavorite);
      return { message: 'Product has been added to favorites' };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAll(user: User): Promise<ProductResponseDto[]> {
    try {
      const favorites = await this.favoriteRepository.findBy({ user });
      // console.log(favorites);
      return favorites.map((fav) => ({
        ...fav.product,
        createdBy: fav.product.createdBy.fullName,
        images: fav.product.images
          .map((image) => image.name)
          .sort()
          .reverse(),
      }));
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }
}
