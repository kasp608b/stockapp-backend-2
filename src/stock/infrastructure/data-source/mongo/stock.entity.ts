import { Document } from 'mongoose';

export interface StockEntity extends Document {
  readonly name: string;
  readonly price: number;
  readonly init_price: number;
  readonly desc: string;
}
