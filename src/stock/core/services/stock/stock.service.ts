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
    const stockEntities = await this.stockRepository.find();
    if (stockEntities) {
      const stocks: Stock[] = JSON.parse(JSON.stringify(stockEntities));
      return stocks;
    } else {
      throw new Error('Could´t find any stocks');
    }
  }

  async updateStockPrice(stock: Stock): Promise<Stock> {
    const newStock = await this.stockRepository.findOne({ id: stock.id });
    if (newStock) {
      newStock.price = stock.price;
      newStock.init_price = stock.init_price;
      newStock.desc = stock.desc;
      await this.stockRepository.update(stock.id, newStock);
      const updatedStock = await this.stockRepository.findOne({
        id: newStock.id,
      });
      if (updatedStock) {
        console.log(updatedStock.price);
        return {
          id: updatedStock.id,
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

  async addStock(stock: Stock): Promise<Stock> {
    const stockDb = await this.stockRepository.findOne({ id: stock.id });
    if (!stockDb) {
      let newStock = this.stockRepository.create();
      newStock.id = stock.id;
      newStock.price = stock.price;
      newStock.init_price = stock.init_price;
      newStock.desc = stock.desc;
      newStock = await this.stockRepository.save(newStock);
      return {
        id: newStock.id,
        price: newStock.price,
        init_price: newStock.init_price,
        desc: newStock.desc,
      };
    } else {
      throw new Error('This stock already exists');
    }
  }

  async deleteStock(stock: Stock): Promise<void> {
    const stockDb = await this.stockRepository.findOne({ id: stock.id });

    if (stockDb) {
      await this.stockRepository.delete({ id: stock.id });
    } else {
      throw new Error('This stock does not exists');
    }
  }

  async findStockById(id: string): Promise<Stock> {
    const stockDb = await this.stockRepository.findOne({ id: id });
    if (stockDb) {
      return {
        id: stockDb.id,
        price: stockDb.price,
        init_price: stockDb.init_price,
        desc: stockDb.desc,
      };
    } else {
      throw new Error('Can´t find a stock with this id');
    }
  }
}
