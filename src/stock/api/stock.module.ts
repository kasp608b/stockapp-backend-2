import { Module } from '@nestjs/common';
import { StockGateway } from './gateways/stock.gateway';
import { StockService } from '../core/services/stock/stock.service';
import { IStockServiceProvider } from '../core/primary-ports/stock.service.interface';
import { StockEntity } from '../infrastructure/data-source/postgres/entities/stockEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoModule } from '../infrastructure/data-source/mongo/mongo.module';
import { stocksProviders } from '../infrastructure/data-source/mongo/stock.providers';
import { StockRepository } from '../infrastructure/data-source/mongo/stock.repository';
import { MongoStockService } from '../core/services/stock/mongoStock.service';

@Module({
  imports: [MongoModule],
  providers: [
    StockGateway,
    {
      provide: IStockServiceProvider,
      useClass: MongoStockService,
    },
    ...stocksProviders,
    StockRepository,
  ],
})
export class StockModule {}
