import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteDto } from './dto/favorite.dto';
import { User } from '../auth/entities/user.entity';
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

  async create(createFavoriteDto: FavoriteDto, user: User) {
    const { productId } = createFavoriteDto;
    const { id: userId } = user;

    const find = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (find)
      throw new BadRequestException(
        'The product has already been added to the favorites',
      );

    try {
      const favoriteProduct = this.favoriteRepository.create({
        user: { id: userId },
        product: { id: productId },
      });
      await this.favoriteRepository.save(favoriteProduct);
      return { message: 'Product has been added to the favorites' };
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

  private async findOne(productId: string, userId: string): Promise<Favorite> {
    const find = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!find)
      throw new NotFoundException('Product not found in the favorites');

    return find;
  }

  async remove(createFavoriteDto: FavoriteDto, user: User) {
    const { productId } = createFavoriteDto;
    const { id: userId } = user;

    const favorite = await this.findOne(productId, userId);

    try {
      const favoriteProduct = await this.favoriteRepository.remove(favorite);
      console.log('favoriteProduct', favoriteProduct);
      return { message: 'Product has been removed to the favorites' };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }
}
