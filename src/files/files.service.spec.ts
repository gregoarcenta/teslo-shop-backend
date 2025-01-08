import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { CloudinaryService } from './services/cloudinary.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FilesService', () => {
  let service: FilesService;
  let cloudinaryService: CloudinaryService;

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
    getImageUrl: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should call CloudinaryService.uploadImage and return its result', async () => {
      const file = {
        originalname: 'image.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const result = { url: 'https://example.com/image.jpg' };

      mockCloudinaryService.uploadImage.mockResolvedValue(result);

      const response = await service.uploadImage(file);

      expect(response).toEqual(result);
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(file);
    });

    it('should throw an InternalServerErrorException if uploadImage fails', async () => {
      const file = {
        originalname: 'image.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      mockCloudinaryService.uploadImage.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(service.uploadImage(file)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getImage', () => {
    it('should call CloudinaryService.getImageUrl and return its result', async () => {
      const imageName = 'image.jpg';
      const publicId = 'image';
      const result = 'https://example.com/image.jpg';

      mockCloudinaryService.getImageUrl.mockResolvedValue(result);

      const response = await service.getImage(imageName);

      expect(response).toEqual(result);
      expect(cloudinaryService.getImageUrl).toHaveBeenCalledWith(publicId);
    });

    it('should propagate errors thrown by CloudinaryService.getImageUrl', async () => {
      const imageName = 'image.jpg';
      const publicId = 'image';

      mockCloudinaryService.getImageUrl.mockRejectedValue(
        new Error('Image not found'),
      );

      await expect(service.getImage(imageName)).rejects.toThrow(
        'Image not found',
      );
      expect(cloudinaryService.getImageUrl).toHaveBeenCalledWith(publicId);
    });
  });

  describe('deleteImage', () => {
    it('should call CloudinaryService.deleteImage and return a success message', async () => {
      const imageId = '123';

      mockCloudinaryService.deleteImage.mockResolvedValue(undefined);

      const response = await service.deleteImage(imageId);

      expect(response).toEqual({
        message: `The image with the id: ${imageId} was removed`,
      });
      expect(cloudinaryService.deleteImage).toHaveBeenCalledWith(imageId);
    });

    it('should throw a NotFoundException if the image does not exist', async () => {
      const imageId = '123';

      mockCloudinaryService.deleteImage.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(service.deleteImage(imageId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException for other errors', async () => {
      const imageId = '123';

      mockCloudinaryService.deleteImage.mockRejectedValue(
        new Error('Deletion failed'),
      );

      await expect(service.deleteImage(imageId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
