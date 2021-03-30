import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StockEntity {
  @PrimaryColumn({ unique: true })
  name: string;
  @Column()
  price: number;
  @Column()
  init_price: number;
  @Column()
  desc: string;
}
