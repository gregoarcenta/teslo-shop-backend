import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IPayloadJwt } from './strategies/jwt.strategy';
import { User } from './entities/user.entity';
import { SignInDto, SignUpDto, UserResponseDto } from './dto';
import { HandlerException } from '../../common/exceptions/handler.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly handlerException: HandlerException,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; data: UserResponseDto }> {
    const user = this.usersRepository.create({
      ...signUpDto,
      password: await bcrypt.hash(signUpDto.password, 10),
    });

    try {
      await this.usersRepository.save(user);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    this.eventEmitter.emit('user.created', user);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      message: 'Your account has been successfully created!',
      data: {
        user: await this.findUser(user.id),
        accessToken: await this.getJwtToken({ id: user.id }),
        cartId: await this.findCartIdByUser(user.id),
      },
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ message: string; data: UserResponseDto }> {
    let user: User;
    try {
      user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email: signInDto.email })
        .getOne();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isValidPassword)
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      message: 'Logged in successfully!',
      data: {
        user: await this.findUser(user.id),
        accessToken: await this.getJwtToken({ id: user.id }),
        cartId: await this.findCartIdByUser(user.id),
      },
    };
  }

  async checkStatus(user: User): Promise<UserResponseDto> {
    return {
      user,
      accessToken: await this.getJwtToken({ id: user.id }),
      cartId: await this.findCartIdByUser(user.id),
    };
  }

  async findUser(id: string): Promise<User> {
    let user: User;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!user) throw new NotFoundException("User can't be found");

    return user;
  }

  private async findCartIdByUser(userId: string): Promise<string> {
    let result: { cartId: string };

    try {
      result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.cart', 'cart')
        .select('cart.id', 'cartId')
        .where('user.id = :userId', { userId })
        .getRawOne();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!result || !result.cartId) {
      throw new NotFoundException("Cart can't be found");
    }

    return result.cartId;
  }

  private async getJwtToken(payload: IPayloadJwt): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async removeAll(): Promise<void> {
    const query = this.usersRepository.createQueryBuilder();
    try {
      await query.delete().execute();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }
}
