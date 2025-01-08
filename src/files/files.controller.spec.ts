import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

import { Response } from 'express';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  const mockFilesService = {
    uploadImage: jest.fn(),
    getImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call FilesService.uploadImage and return its result', async () => {
    const file = {
      originalname: 'image.jpg',
      buffer: Buffer.from(''),
    } as Express.Multer.File;
    const result = { message: 'Image uploaded successfully' };

    mockFilesService.uploadImage.mockResolvedValue(result);

    const response = await controller.uploadImage(file);

    expect(response).toEqual(result);
    expect(service.uploadImage).toHaveBeenCalledWith(file);
  });

  it('should call FilesService.getImage and redirect to the returned URL', async () => {
    const imageName = 'image.jpg';
    const imageUrl = 'https://cloudinary.com/example.jpg';
    const mockRes = { redirect: jest.fn() } as unknown as Response;

    mockFilesService.getImage.mockResolvedValue(imageUrl);

    await controller.getImage(imageName, mockRes);

    expect(service.getImage).toHaveBeenCalledWith(imageName);
    expect(mockRes.redirect).toHaveBeenCalledWith(imageUrl);
  });

  it('should call FilesService.deleteImage and return its result', async () => {
    const imageId = '123';
    const result = { message: 'Image deleted successfully' };

    mockFilesService.deleteImage.mockResolvedValue(result);

    const response = await controller.deleteImage(imageId);

    expect(response).toEqual(result);
    expect(service.deleteImage).toHaveBeenCalledWith(imageId);
  });
});
