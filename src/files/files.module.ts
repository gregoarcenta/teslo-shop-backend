import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from './services/cloudinary.service';
import { CloudinaryProvider } from '../config/cloudinary.config';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService, CloudinaryProvider.config()],
  imports: [AuthModule],
})
export class FilesModule {}
