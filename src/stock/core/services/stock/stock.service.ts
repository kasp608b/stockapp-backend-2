import { Injectable } from '@nestjs/common';
import { Stock } from '../../models/stock.model';
import { IStockService } from '../../primary-ports/stock.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from '../../../infrastructure/data-source/entities/stockEntity';
import { Repository } from 'typeorm';

@Injectable()
export class StockService implements IStockService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
  ) {}

  async getStocks(): Promise<Stock[]> {
    const stocks = await this.stockRepository.find();
    return stocks;
  }

  async updateStockPrice(stock: Stock): Promise<Stock> {
    const newStock = await this.stockRepository.findOne({ id: stock.id });
    newStock.price = stock.price;
    await this.stockRepository.update(stock.id, newStock);
    const updatedStock = await this.stockRepository.findOne({ id: stock.id });
    console.log(updatedStock.price);
    return updatedStock;
  }
}
