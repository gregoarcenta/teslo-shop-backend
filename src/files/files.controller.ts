import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '../config';
import { Response } from 'express';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiDeleteImageResponse,
  ApiGetImageResponse,
  ApiUploadImageResponse,
} from '../swagger/decorators/files';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product/image')
  @Auth(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'), ApiResponseInterceptor)
  @ApiUploadImageResponse()
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg|jpg|png|gif' })
        .addMaxSizeValidator({ maxSize: 250000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(file);
  }

  @Get('product/image/:imageName')
  @ApiGetImageResponse()
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const url = await this.filesService.getImage(imageName);
    res.redirect(url);
  }

  @Delete('product/image/:id')
  @Auth(Role.ADMIN)
  @UseInterceptors(ApiResponseInterceptor)
  @ApiDeleteImageResponse()
  deleteImage(@Param('id') id: string) {
    return this.filesService.deleteImage(id);
  }
}
