import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateNewsLetterDto {
    @ApiProperty({
        description:"Name of the user",
        example:"Milon Hossain"
    })
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty({
        description:"Email of the user",
        example:"milonhossain@gmail.com"
    })
    @IsString()
    @IsNotEmpty()
    email:string

    @ApiProperty({
        description:"Message of the user",
        example:"Hello, I am Milon Hossain"
    })
    @IsString()
    @IsNotEmpty()
    message:string


    @ApiProperty({
        description:"Accepted terms of the user",
        example:true
    })
    @IsNotEmpty()
    acceptedTerms:boolean
}
