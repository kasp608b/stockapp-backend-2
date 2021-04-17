import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { StockEntity } from './stock.entity';
import { Stock } from '../../../core/models/stock.model';

@Injectable()
export class StockRepository {
  constructor(
    @Inject('STOCK_MODEL')
    private stockDBModel: Model<StockEntity>,
  ) {}

  async addStock(stock: Stock): Promise<Stock> {
    //Convert to Entity
    const createdStock = new this.stockDBModel(stock);
    const stockEntitySaved = await createdStock.save();
    const stockToReturn: Stock = {
      name: stockEntitySaved.name,
      price: stockEntitySaved.price,
      init_price: stockEntitySaved.init_price,
      desc: stockEntitySaved.desc,
    };
    console.log('entity saved', stockToReturn);
    return stockToReturn;
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockDBModel.find().exec();
  }

  async findOne(name: string): Promise<Stock> {
    return await this.stockDBModel.findOne({ name: name }).exec();
  }

  async delete(name: string): Promise<void> {
    await this.stockDBModel.deleteOne({ name: name }).exec();
  }

  async update(stock: Stock): Promise<Stock> {
    const updatedStock = new this.stockDBModel(stock);
    const updateResult = await this.stockDBModel
      .updateOne(
        {
          name: updatedStock.name,
        },
        updatedStock,
      )
      .exec();
    const updatedStockEntity = await this.stockDBModel.findOne({
      name: updatedStock.name,
    });
    const stockToReturn: Stock = {
      name: updatedStockEntity.name,
      price: updatedStockEntity.price,
      init_price: updatedStockEntity.init_price,
      desc: updatedStockEntity.desc,
    };
    console.log('entity updated', stockToReturn);
    return stockToReturn;
  }
}
