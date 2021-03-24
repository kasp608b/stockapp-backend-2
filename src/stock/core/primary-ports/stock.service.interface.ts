import { Stock } from '../models/stock.model';

export const IStockServiceProvider = 'IStockServiceProvider';
export interface IStockService {
  getStocks(): Promise<Stock[]>;

  updateStockPrice(stock: Stock): Promise<Stock>;
}
