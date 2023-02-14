import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
  ) { }


  async execute() {
    await this.insertNewProducts()
    return `SEED EXECUTED`;
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts()

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productService.create(product)
      )
    })

    const results = await Promise.all(insertPromises)

    return true;
  }

}
