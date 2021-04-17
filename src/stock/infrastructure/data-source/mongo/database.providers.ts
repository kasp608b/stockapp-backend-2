import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://admin:admin123@localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'stocks',
        user: 'root',
        pass: 'admin',
      }),
  },
];
