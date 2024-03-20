import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentWallet } from '../jwt/jwt.decorator';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalRequestDto } from './dto/withdrawal.request';


@Controller('api/v1/wallet')
export class WithdrawalController {

    constructor(private service: WithdrawalService) { }

    @UsePipes(new ValidationPipe())
    @Post('withdrawals')
    async withdrawVirtualMoney(@CurrentWallet() wallet, @Body() dto: WithdrawalRequestDto) {
        return await this.service.withdrawVirtualMoney(wallet, dto);
    }
}
