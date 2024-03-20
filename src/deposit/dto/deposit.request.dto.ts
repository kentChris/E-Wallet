import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsUUID } from "class-validator";

export class DepositRequestDto {
    @ApiProperty()
    @IsNotEmpty({message: "Missing data for required field" })
    @IsUUID()
    reference_id: string;

    @ApiProperty()
    @IsNotEmpty({message: "Missing data for required field" })
    @IsPositive({ message: 'Value must be above 0' })
    amount: number;
}