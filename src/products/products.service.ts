import { NotFoundException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities';
//TODO: buscar patron repositorio
//TODO: buscar transacciones



@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      //type orm infiere que se esta creando un producto y asigna el productId en image
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      })
      await this.productRepository.save(product);

      return { ...product, images: images };

    } catch (error) {
      //console.log(error)
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))

  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('LOWER(title) =:title or slug=:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages').getOne();
    }


    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`)
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img => img.url)

    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {


    //TODO:Transacciones
    const { images, ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    })

    if (!product)
      throw new NotFoundException(`Product with od: ${id} not found`)

    //TODO: queryRunner //injectamos DataSource el cual sabe la cadena de conexion y usuario

    // dataSource posee un querybuilder para ser usado, el cual no viene a partir de una entidad
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      //cuidado porque puedo borrar todo
      //aca borramos las imagenes
      if (images) {
        //esto es una transaccion
        //ese es el id del producto (en la tabla de imagenes se llama productID)
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }

      // esto es otra transaccion
      await queryRunner.manager.save(product)

      //TODO:las transacciones no impactan la base de datos hasta que haga el commit

      // await this.productRepository.save(product)

      // ejecuta el commit
      await queryRunner.commitTransaction()

      //cierro el queryRunner
      await queryRunner.release()
      return this.findOnePlain(id);
    } catch (error) {

      //TODO: aca hacemos el rollback si sale mal
      await queryRunner.rollbackTransaction()
      await queryRunner.release()

      this.handleDBExceptions(error)
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)


  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
}
