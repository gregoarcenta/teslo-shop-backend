import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(), // Aquí mockeamos upload_stream
      destroy: jest.fn(),
    },
    api: {
      resource: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(cloudinaryService).toBeDefined();
  });

  it('should upload an image successfully', async () => {
    // Simulamos la respuesta exitosa de Cloudinary
    const mockUploadResponse: any = {
      public_id: 'sample_public_id',
      format: 'jpg',
      secure_url:
        'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
    };

    // Aquí estamos simulando que Cloudinary sube la imagen y nos da la respuesta mockeada
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce(
      (callback) => {
        callback(null, mockUploadResponse); // Simula respuesta exitosa
      },
    );

    // Simulamos un archivo
    const file: Express.Multer.File = {
      buffer: Buffer.from('sample file content'),
      originalname: 'test.jpg',
    } as any;

    const result = await cloudinaryService.uploadImage(file);

    // Comprobamos que el resultado es el esperado
    expect(result).toEqual({ public_id: 'sample_public_id', format: 'jpg' });
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
  });

  it('should throw error when image not found', async () => {
    const mockError = { error: { http_code: 404 } };

    (cloudinary.api.resource as jest.Mock).mockRejectedValue(mockError);

    await expect(
      cloudinaryService.getImageUrl('sample_public_id'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw error when there is an internal server error', async () => {
    const mockError = { error: { http_code: 500 } };

    (cloudinary.api.resource as jest.Mock).mockRejectedValue(mockError);

    await expect(
      cloudinaryService.getImageUrl('sample_public_id'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should delete an image successfully', async () => {
    const mockDeleteResponse = { result: 'ok' };

    (cloudinary.uploader.destroy as jest.Mock).mockImplementationOnce(
      (id, options, callback) => {
        callback(null, mockDeleteResponse);
      },
    );

    const result = await cloudinaryService.deleteImage('sample_public_id');
    expect(result).toEqual(mockDeleteResponse);
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
  });

  it('should throw error when trying to delete image that is not found', async () => {
    const mockDeleteResponse = { result: 'not found' };

    (cloudinary.uploader.destroy as jest.Mock).mockImplementationOnce(
      (id, options, callback) => {
        callback(null, mockDeleteResponse);
      },
    );

    await expect(
      cloudinaryService.deleteImage('sample_public_id'),
    ).rejects.toThrow(NotFoundException);
  });
});
