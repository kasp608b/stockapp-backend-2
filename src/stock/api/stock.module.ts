import { Module } from '@nestjs/common';
import { StockGateway } from './gateways/stock.gateway';
import { StockService } from '../core/services/stock/stock.service';
import { IStockServiceProvider } from '../core/primary-ports/stock.service.interface';
import { StockEntity } from '../infrastructure/data-source/entities/stockEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [
    StockGateway,
    {
      provide: IStockServiceProvider,
      useClass: StockService,
    },
  ],
})
export class StockModule {}
