import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'd9e4a3b2-a3b2-c3d4-e5f6-a3b2c3d4e5f6',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty(
        {
            example: 0,
            description: 'Product Price',
        }
    )
    @Column('float', {
        default: 0
    })
    price: number

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        description: 'Product Description',
        default:null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty(
        {
            example: 't_shirt_teslo',
            description: 'Product SLUG',
            uniqueItems:true
        }
    )
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 1,
        description: 'Product Stock',
        default:0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: [
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL"
          ],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty(
        {
            example: 'unisex',
            description: 'Product Gender',
        }
    )
    @Column('text')
    gender: string;

    @ApiProperty(
        {
            example: ['hoddie'],
            description: 'Product Tags',
            default:[]
        }
    )
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true } //eager carga las relaciones
    )
    user: User;

    //eager carga las relaciones
    //eager no funciona en querybuilder
    //uno a muchos
    @ApiProperty({
        example:[
            "8529312-00-A_0_2000.jpg",
            "8529312-00-A_1.jpg"
          ],
          default:[],
          description:'Product Images'
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }


}
