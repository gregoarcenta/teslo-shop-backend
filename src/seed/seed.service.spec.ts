import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { AuthService } from '../auth/auth.service';
import { ProductsService } from '../products/products.service';
import { UserResponseDto } from '../auth/dto';
import { User } from '../auth/entities/user.entity';

jest.mock('../auth/auth.service');
jest.mock('../products/products.service');

describe('SeedService', () => {
  let seedService: SeedService;
  let authService: AuthService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedService, AuthService, ProductsService],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    authService = module.get<AuthService>(AuthService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });

  it('should execute the seed process successfully', async () => {
    (productsService.removeAll as jest.Mock).mockResolvedValue(undefined);
    (authService.removeAll as jest.Mock).mockResolvedValue(undefined);

    const mockUserResponse: UserResponseDto = {
      user: {
        id: '1',
        email: 'admin@admin.com',
        fullName: 'Admin',
      } as User,
      accessToken: 'accessToken',
    };
    (authService.signUp as jest.Mock).mockResolvedValue(mockUserResponse);

    (productsService.create as jest.Mock).mockResolvedValue(undefined);

    const result = await seedService.runSeed();

    expect(result).toBe('Execute Seed');
    expect(productsService.removeAll).toHaveBeenCalledTimes(1);
    expect(authService.removeAll).toHaveBeenCalledTimes(1);
    expect(authService.signUp).toHaveBeenCalledTimes(2);
    expect(productsService.create).toHaveBeenCalledTimes(52);
  });

  it('should handle errors during the seed process', async () => {
    const errorMessage = 'Error during seed process';

    (productsService.removeAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );
    (authService.removeAll as jest.Mock).mockResolvedValue(undefined);

    try {
      await seedService.runSeed();
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }

    expect(productsService.removeAll).toHaveBeenCalledTimes(1);
    expect(authService.removeAll).toHaveBeenCalledTimes(0);
  });
});
