import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsUUID } from "class-validator";

export class WithdrawalRequestDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty({message: "Missing data for required field" })
    reference_id: string;

    @ApiProperty()
    @IsPositive({ message: 'Value must be above 0' })
    @IsNotEmpty({message: "Missing data for required field" })
    amount: number;
}