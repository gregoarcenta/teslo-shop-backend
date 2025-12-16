import { Injectable } from '@nestjs/common';

import { initialData } from './data/seed-data';
import { ProductsService } from '../products/products.service';
import { User } from '../modules/auth/entities/user.entity';
import { AuthService } from '../modules/auth/auth.service';
import { UserResponseDto } from '../modules/auth/dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);
    return {
      message: 'Seed executed successfully',
    };
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    await this.authService.removeAll();
  }

  private async insertUsers(): Promise<User> {
    const users = initialData.users;
    let insertPromises: Promise<{ data: UserResponseDto }>[] = [];
    for (const user of users) {
      insertPromises.push(this.authService.signUp(user));
    }
    const [adminUser, _] = await Promise.all(insertPromises);
    return adminUser.data.user;
  }

  private async insertProducts(adminUser: User) {
    const products = initialData.products;

    let insertPromises = [];

    for (const product of products) {
      insertPromises.push(this.productsService.create(product, adminUser));
    }

    await Promise.all(insertPromises);
  }
}
