import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFileter.helper';
import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {



  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService

  ) { }

  // No es recomedable subir archivos donde se encuentra el codigo de la aplicacion
  // ya que alguien puede subir archivo malicioso


  //TODO:  Anotacion!!: .gitkeep es para mantener un directorio vacio en git
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limit:{fileSize:1000}
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) throw new BadRequestException(`Make sure that the file is an image`)

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return {
      secureUrl
    }
  }


  // decorador @Res quita el control a nest de emitir respuesta
  // y tengo que responder manualmente
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName)
    return res.sendFile(path)
  }
}
