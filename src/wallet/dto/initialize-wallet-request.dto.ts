import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class InitializeWalletRequestDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty({message: "Missing data for required field" })
    customer_xid: string;
}