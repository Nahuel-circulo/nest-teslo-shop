import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";




export class CreateUserDto {

    @ApiProperty({
        description:'User email (unique)',
        example:'hello@google.com'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description:"Must have a Uppercase, lowercase letter and a number. Min Length 8 ",
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

    @ApiProperty({
        description:"User full name",
        example:"Jhon Doe"
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    fullName: string;

}