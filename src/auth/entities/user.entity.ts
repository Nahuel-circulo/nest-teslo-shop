import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    //select para no mostrar la contraseña
    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }
}
