
// como recibe la data desde las consultas

import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength
} from "class-validator";

export class CreateProductDto {


    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsPositive()
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    sizes: string[];

   
    @ApiProperty()
    @IsIn(['men','women','kids','unisex'])
    gender: string;

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[];


    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
    


}
