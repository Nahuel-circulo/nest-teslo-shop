import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService) { }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      console.log('hola')
      return 

    }
    console.log({payload})
    this.messagesWsService.registerClient(client)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // Emite unicamente al cliente
    // client.emit('message-from-server', {fullName:'soy yo',payload: payload.message || 'no-message!!'})

    // Emite a todos menos al cliente
    // client.broadcast.emit('message-from-server', {fullName:'soy yo',payload: payload.message || 'no-message!!'})

    // Emite a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no-message!!'
    })
  }

}
