import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendOtpDTO {
    @ApiProperty({
        description: 'Here will go user phone',
        example: '01700000000', 
    })
    @IsNotEmpty()
    phone:string
}