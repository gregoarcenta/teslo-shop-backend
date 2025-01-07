import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File) {
    try {
      return await this.cloudinaryService.uploadImage(file);
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException('Cannot upload file');
    }
  }

  async getImage(imageName: string) {
    const publicId = imageName.split('.')[0];
    try {
      return await this.cloudinaryService.getImageUrl(publicId);
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  async deleteImage(id: string): Promise<{ message: string }> {
    try {
      await this.cloudinaryService.deleteImage(id);
      return { message: `The image with the id: ${id} was removed` };
    } catch (err) {
      this.logger.error(err.message);

      if (err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException("The image couldn't be deleted.");
    }
  }
}
