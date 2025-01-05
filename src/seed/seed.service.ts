import { Injectable } from '@nestjs/common';
// import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  // private readonly productsService: ProductsService,
  constructor(private readonly authService: AuthService) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    // await this.insertProducts(adminUser);
    return 'Execute Seed';
  }

  private async deleteTables() {
    // await this.productsService.removeAll();
    await this.authService.removeAllUsers();
  }

  private async insertUsers(): Promise<void> {
    const users = initialData.users;

    for (const user of users) {
      await this.authService.signUp(user);
    }
  }

  // private async insertProducts(adminUser: User) {
  //   const products = initialData.products;
  //
  //   let insertPromises = [];
  //
  //   for (const product of products) {
  //     insertPromises.push(this.productsService.create(product, adminUser));
  //   }
  //
  //   await Promise.all(insertPromises);
  // }
}
