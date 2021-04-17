import { Connection } from 'mongoose';
import { StockSchema } from './stock.schema';

export const stocksProviders = [
  {
    provide: 'STOCK_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('StockEntity', StockSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
