import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InitializeWalletRequestDto } from './dto/initialize-wallet-request.dto';
import { CurrentWallet } from '../jwt/jwt.decorator';
import { Wallet } from '../entity/wallet.entity';
import { WalletFacade } from './wallet.facade';

@Controller('api/v1/')
export class WalletController {

    constructor(private facade: WalletFacade) { }

    @UsePipes(new ValidationPipe())
    @Post('init')
    async initializeWallet(@Body() dto: InitializeWalletRequestDto): Promise<{token:string}> {
        return await this.facade.initializeWallet(dto);
    }

    @UsePipes(new ValidationPipe())
    @Get('login')
    async login(@Body() dto: InitializeWalletRequestDto): Promise<{token: string}> {
        return await this.facade.login(dto);
    }

    @Post('wallet')
    async enableWallet(
        @CurrentWallet() wallet: Wallet,
    ) {
        return await this.facade.enableWallet(wallet);
    }

    @Get('wallet')
    async getWalletBalance (
        @CurrentWallet() wallet: Wallet,
    ): Promise<{wallet: Wallet}> {
        return await this.facade.getWalletBalance(wallet);
    }

    @Patch('wallet')
    async disableWallet(
        @CurrentWallet() wallet: Wallet,
    ) {
        return await this.facade.disableWallet(wallet);
    }
}
