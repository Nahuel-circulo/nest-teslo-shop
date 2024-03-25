import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";




export class LoginUserDto {

    @ApiProperty({
        example:"hello@google.com"
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        example:"Example1"
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;


}