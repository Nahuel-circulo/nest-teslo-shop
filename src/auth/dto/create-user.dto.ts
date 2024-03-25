import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";




export class CreateUserDto {

    @ApiProperty({
        description:'User email (unique)'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description:"Must have a Uppercase, lowercase letter and a number. Min Length 8 "
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    fullName: string;

}