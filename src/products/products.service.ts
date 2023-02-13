import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';


// buscar patron repositorio
// buscar transacciones



@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      //console.log(error)
      this.handleDBExceptions(error)
    }
  }

  async findAll() {
    return await this.productRepository.find()
  }

  async findOne(id: string) {
    return await this.productRepository.findOneBy({id});
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
