import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

export interface ChatMessage {
  user: string;
  text: string;
  timestamp: number; 
}

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket?: Socket;
  private username = '';

  private connectedUsers$ = new Subject<string>();
  private messages$ = new Subject<ChatMessage>();
  private disconnect$ = new Subject<string>();

  connect(username: string): void {
    if (this.socket?.connected) return;
    this.username = username.trim();

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      this.socket?.emit('user_connected', this.username);
    });


    this.socket.on('message', (data: ChatMessage) => {
      this.messages$.next(data);
    });


    this.socket.on('user_connected', (usernameFromServer: string) => {
      this.connectedUsers$.next(usernameFromServer);
    });


    this.socket.on('disconnect', (reason: string) => {
      this.disconnect$.next(reason);
    });
  }

  sendMessage(text: string): void {
    if (!this.socket || !this.socket.connected) return;
    const message: ChatMessage = {
      user: this.username,
      text: text.trim(),
      timestamp: Date.now()
    };
    this.socket.emit('message', message);
  }

  onMessage(): Observable<ChatMessage> {
    return this.messages$.asObservable();
  }

  onUserConnected(): Observable<string> {
    return this.connectedUsers$.asObservable();
  }

  onDisconnect(): Observable<string> {
    return this.disconnect$.asObservable();
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  getUsername(): string {
    return this.username;
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
