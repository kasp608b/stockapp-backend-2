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
//WHat
@WebSocketGateway()
export class StockGateway implements OnGatewayConnection {
  constructor(
    @Inject(IStockServiceProvider) private stockService: IStockService,
  ) {}
  @WebSocketServer() server;
  @SubscribeMessage('updateStock')
  async handleUpdateStockPrice(
    @MessageBody() stock: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newStock = await this.stockService.updateStockPrice(stock);
      if (newStock) {
        console.log('Stuff is happening');
        client.emit('stockPriceUpdated', newStock);
        this.server.emit('allStocks', await this.stockService.getStocks());
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('addStock')
  async handleAddStock(
    @MessageBody() stock: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newStock = await this.stockService.addStock(stock);
      if (newStock) {
        this.server.emit('allStocks', await this.stockService.getStocks());
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('deleteStock')
  async handleDeleteStock(
    @MessageBody() stock: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.stockService.deleteStock(stock);
      this.server.emit('allStocks', await this.stockService.getStocks());
    } catch (e) {
      client.error(e.message);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    try {
      console.log('Client Connect', client.id);
      client.emit('allStocks', await this.stockService.getStocks());
    } catch (e) {
      client.error(e.message);
    }
  }
}
