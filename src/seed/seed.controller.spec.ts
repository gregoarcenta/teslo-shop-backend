import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  let seedController: SeedController;
  let seedService: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        {
          provide: SeedService,
          useValue: {
            runSeed: jest.fn(), // Mock de runSeed
          },
        },
      ],
    }).compile();

    seedController = module.get<SeedController>(SeedController);
    seedService = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(seedController).toBeDefined();
  });

  it('should call runSeed and return a successful response', async () => {
    const mockResponse = 'Seed has been successfully executed';

    (seedService.runSeed as jest.Mock).mockResolvedValue(mockResponse);

    const result = await seedController.executeSeed();

    expect(result).toBe(mockResponse);
    expect(seedService.runSeed).toHaveBeenCalledTimes(1);
  });
});
