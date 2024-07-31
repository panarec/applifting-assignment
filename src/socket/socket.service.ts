import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);
    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  emitEvent(event: string, data: any): void {
    this.connectedClients.forEach((socket) => {
      socket.emit(event, data);
    });
  }
}
