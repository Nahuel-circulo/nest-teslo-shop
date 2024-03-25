import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @ApiProperty({
        example: 'd4e4a2b2-a3b2-c3d4-e5f6-a3b2c2d3e2ea',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'hello@google.com',
        description: 'User email',
        uniqueItems: true
    })

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    //select para no mostrar la contraseña
    @ApiProperty({
        description:'User password'
    })
    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @ApiProperty({
        example:' Jhon Doe',
        description:'User full name'
    })
    @Column({
        type: 'text'
    })
    fullName: string;

    @ApiProperty()
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example:["admin","user","super_user"]
    })
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];


    @OneToMany(
        () => Product,
        (product) => product.user,
        { cascade: true } //eager carga las relaciones

    )
    product: Product



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }
}
