import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: { socker: Socket, user: User }
}
@Injectable()
export class MessagesWsService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) { }
  private connectedClients: ConnectedClients = {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');



    this.connectedClients[client.id] = {
      socker: client,
      user: user,
    };

  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }
}
