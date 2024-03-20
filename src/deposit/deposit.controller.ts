import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentWallet } from '../jwt/jwt.decorator';
import { DepositService } from './deposit.service';
import { DepositRequestDto } from './dto/deposit.request.dto';

@Controller('api/v1/wallet')
export class DepositController {

    constructor(private service: DepositService) { }

    @UsePipes(new ValidationPipe())
    @Post('deposits')
    async addVirtualMoney(@CurrentWallet() wallet, @Body() dto: DepositRequestDto) {
        return await this.service.addVirtualMoney(wallet, dto);
    }
}
