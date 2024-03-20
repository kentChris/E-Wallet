import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InitializeWalletRequestDto } from './dto/initialize-wallet-request.dto';
import { Wallet, Wallet_Status_Enum } from '../entity/wallet.entity';
import { JwtTokenService } from '../jwt/jwt.service';
import { WalletService } from './wallet.service';

@Injectable()
export class WalletFacade {
    constructor(
        private service: WalletService,
        private readonly jwtService: JwtTokenService,
    ) { }

    public async initializeWallet(customerDto: InitializeWalletRequestDto) {
        const wallet = await this.service.getWithFilter({owned_by: customerDto.customer_xid});

        if(wallet) {
            throw new BadRequestException("user has been initialize before");
        };

        const walletDto = new Wallet();
        walletDto.balance = 0;
        walletDto.owned_by = customerDto.customer_xid;
        walletDto.status = Wallet_Status_Enum.DISABLE;

        const userWallet = await this.service.createWallet(walletDto);

        const token = await this.jwtService.generateToken({ id: userWallet.id, customer_xid: userWallet.owned_by });

        return { token };
    };

    public async login(customerDto: InitializeWalletRequestDto) {
        const wallet = await this.service.getWithFilter({owned_by: customerDto.customer_xid});

        if(!wallet) {
            throw new BadRequestException("user has not been initialize");
        };

        const token = await this.jwtService.generateToken({ id: wallet.id, customer_xid: wallet.owned_by });
        return { token };
    };

    public async enableWallet(walletToken: Wallet) {
        const wallet = await this.service.getWithFilter({id: walletToken.id});

        try {
            await this.isWalletDisabled(wallet);
        } catch(e) {
            throw new BadRequestException('Already enabled');
        }

        wallet.status = Wallet_Status_Enum.ENABLE;
        wallet.enabled_at = new Date();
    
        await this.service.updateWalletById(walletToken.id, wallet);

        const result = await this.service.getWithFilter({id: walletToken.id});

        return { wallet: result };
    }

    public async getWalletBalance(walletToken: Wallet): Promise<{wallet: Wallet}> {
        const wallet = await this.service.getWithFilter({id: walletToken.id});

    try{
        await this.isWalletEnabled(wallet);
    }catch(e) {
        throw new NotFoundException("Wallet disabled");
    }

        return { wallet };
    }

    private isWalletEnabled(wallet?: Wallet) {
        if(!wallet || wallet?.status === Wallet_Status_Enum.DISABLE) {
            throw new BadRequestException('wallet must be enabled');
        };
    }

    private isWalletDisabled(wallet?: Wallet) {
        if(!wallet || wallet?.status === Wallet_Status_Enum.ENABLE) {
            throw new BadRequestException();
        };
    }

    public async disableWallet(walletToken: Wallet) {
        const wallet = await this.service.getWithFilter({id: walletToken.id});

        try {
            await this.isWalletEnabled(wallet);
        } catch(e) {
            throw new BadRequestException('Already disabled');
        }

        wallet.status = Wallet_Status_Enum.DISABLE;
    
        await this.service.updateWalletById(walletToken.id, wallet);

        const result = await this.service.getWithFilter({id: walletToken.id});

        return { wallet: result };
    }
}   
