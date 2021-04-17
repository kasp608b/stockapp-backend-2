import { Injectable } from '@nestjs/common';
import { StockRepository } from '../../../infrastructure/data-source/mongo/stock.repository';
import { IStockService } from '../../primary-ports/stock.service.interface';
import { Stock } from '../../models/stock.model';

@Injectable()
export class MongoStockService implements IStockService {
  constructor(private stockRepository: StockRepository) {}

  async addStock(stock: Stock): Promise<Stock> {
    if (stock.name.length < 2) {
      throw new Error('Stock name must be more then 2 chars');
    }
    const stockCreated = this.stockRepository.addStock(stock);
    return stockCreated;
  }

  async deleteStock(stock: Stock): Promise<void> {
    const stockDb = await this.stockRepository.findOne(stock.name);

    if (stockDb) {
      await this.stockRepository.delete(stock.name);
    } else {
      throw new Error('This stock does not exists');
    }
  }

  async findStockById(id: string): Promise<Stock> {
    const stockDb = await this.stockRepository.findOne(id);
    if (stockDb) {
      return {
        name: stockDb.name,
        price: stockDb.price,
        init_price: stockDb.init_price,
        desc: stockDb.desc,
      };
    } else {
      throw new Error('Can´t find a stock with this id');
    }
  }

  async getStocks(): Promise<Stock[]> {
    const stockEntities = await this.stockRepository.findAll();
    if (stockEntities) {
      const stocks: Stock[] = JSON.parse(JSON.stringify(stockEntities));
      return stocks;
    } else {
      throw new Error('Could´t find any stocks');
    }
  }

  async updateStockPrice(stock: Stock): Promise<Stock> {
    const newStock = await this.stockRepository.findOne(stock.name);
    if (newStock) {
      newStock.price = stock.price;
      newStock.init_price = stock.init_price;
      newStock.desc = stock.desc;
      await this.stockRepository.update(newStock);
      const updatedStock = await this.stockRepository.findOne(newStock.name);
      if (updatedStock) {
        console.log(updatedStock.price);
        return {
          name: updatedStock.name,
          price: updatedStock.price,
          init_price: updatedStock.init_price,
          desc: updatedStock.desc,
        };
      } else {
        throw new Error('Update failed');
      }
    } else {
      throw new Error('This stock does not exist');
    }
  }
}
