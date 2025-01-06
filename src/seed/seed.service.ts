import { Injectable } from '@nestjs/common';
// import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';
import { initialData } from './data/seed-data';
import { ProductsService } from '../products/products.service';
import { User } from '../auth/entities/user.entity';
import { UserResponseDto } from '../auth/dto/user-response.dto';

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
    return 'Execute Seed';
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    await this.authService.removeAll();
  }

  private async insertUsers(): Promise<User> {
    const users = initialData.users;
    let insertPromises: Promise<UserResponseDto>[] = [];
    for (const user of users) {
      insertPromises.push(this.authService.signUp(user));
    }
    const [adminUser, _] = await Promise.all(insertPromises);
    return adminUser.user;
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
