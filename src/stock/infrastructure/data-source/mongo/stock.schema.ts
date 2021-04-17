import * as mongoose from 'mongoose';

export const StockSchema = new mongoose.Schema({
  name: String,
  price: Number,
  init_price: Number,
  desc: String,
});
