import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { StockService } from '../../core/services/stock/stock.service';
import { Stock } from '../../core/models/stock.model';
import { Inject } from '@nestjs/common';
import {
  IStockService,
  IStockServiceProvider,
} from '../../core/primary-ports/stock.service.interface';
import { StockDTO } from '../dtos/stock.dto';

//WHat
@WebSocketGateway()
export class StockGateway implements OnGatewayConnection {
  constructor(
    @Inject(IStockServiceProvider) private stockService: IStockService,
  ) {}
  @WebSocketServer() server;
  @SubscribeMessage('updateStock')
  async handleUpdateStockPrice(
    @MessageBody() stockDTO: StockDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const stock: Stock = {
        name: stockDTO.name,
        price: stockDTO.price,
        init_price: stockDTO.init_price,
        desc: stockDTO.desc,
      };
      const newStock = await this.stockService.updateStockPrice(stock);
      if (newStock) {
        console.log('Stuff is happening');
        client.emit('stockPriceUpdated', newStock);
        const stocks = await this.stockService.getStocks();
        const stockDTOs: StockDTO[] = JSON.parse(JSON.stringify(stocks));
        this.server.emit('allStocks', stockDTOs);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('addStock')
  async handleAddStock(
    @MessageBody() stockDTO: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const stock: Stock = {
        name: stockDTO.name,
        price: stockDTO.price,
        init_price: stockDTO.init_price,
        desc: stockDTO.desc,
      };
      const newStock = await this.stockService.addStock(stock);
      if (newStock) {
        const stocks = await this.stockService.getStocks();
        const stockDTOs: StockDTO[] = JSON.parse(JSON.stringify(stocks));
        this.server.emit('allStocks', stockDTOs);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('deleteStock')
  async handleDeleteStock(
    @MessageBody() stockDTO: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const stock: Stock = {
        name: stockDTO.name,
        price: stockDTO.price,
        init_price: stockDTO.init_price,
        desc: stockDTO.desc,
      };
      await this.stockService.deleteStock(stock);
      const stocks = await this.stockService.getStocks();
      const stockDTOs: StockDTO[] = JSON.parse(JSON.stringify(stocks));
      this.server.emit('allStocks', stockDTOs);
    } catch (e) {
      client.error(e.message);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    try {
      console.log('Client Connect', client.id);
      const stocks = await this.stockService.getStocks();
      const stockDTOs: StockDTO[] = JSON.parse(JSON.stringify(stocks));
      client.emit('allStocks', stockDTOs);
    } catch (e) {
      client.error(e.message);
    }
  }
}
