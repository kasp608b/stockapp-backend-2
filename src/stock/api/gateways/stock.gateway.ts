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
  @SubscribeMessage('updateStockPrice')
  async handleUpdateStockPrice(
    @MessageBody() stock: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newStock = await this.stockService.updateStockPrice(stock);
    if (newStock) {
      console.log('Stuff is happenig');
      client.emit('stockPriceUpdated', newStock);
      this.server.emit('allStocks', await this.stockService.getStocks());
    }
  }
  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    console.log('Client Connect', client.id);
    client.emit('allStocks', await this.stockService.getStocks());
  }
}
