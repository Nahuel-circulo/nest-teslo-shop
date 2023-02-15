import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFileter.helper';
import { BadRequestException } from '@nestjs/common/exceptions';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  // No es recomedable subir archivos donde se encuentra el codigo de la aplicacion
  // ya que alguien puede subir archivo malicioso

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {


    if (!file) throw new BadRequestException(`Make sure that the file is an image`)

    return {
      filename: file.originalname
    }
  }
}
