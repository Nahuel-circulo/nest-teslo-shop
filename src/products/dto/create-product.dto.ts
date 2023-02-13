


// como recibe la data desde las consultas

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


    @IsString()
    @MinLength(1)
    title: string;

    @IsPositive()
    @IsOptional()
    @IsNumber()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsArray()
    @IsString({ each: true })
    sizes: string[];

   
    @IsIn(['men','women','kids','unisex'])
    gender: string;


}
