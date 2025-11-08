import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { FormsModule } from '@angular/forms';     
import { SocketService, ChatMessage } from './services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,                               
  imports: [CommonModule, FormsModule],           
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'Chat en tiempo real';
  username = '';
  messageText = '';
  isLogged = false;

  messages: ChatMessage[] = [];
  notifications: string[] = [];

  private subs: Subscription[] = [];

  constructor(private socketSvc: SocketService) {
    this.subs.push(
      this.socketSvc.onMessage().subscribe((msg) => {
        this.messages.push(msg);
        this.scrollToBottom();
      }),
      this.socketSvc.onUserConnected().subscribe((user) => {
        this.notifications.push(`${user} se ha conectado`);
        this.scrollToBottom();
      }),
      this.socketSvc.onDisconnect().subscribe((reason) => {
        this.notifications.push(`Desconectado: ${reason}`);
        this.isLogged = false;
      })
    );
  }

  login(): void {
    const valid = this.username.trim().length >= 3;
    if (!valid) return;

    this.socketSvc.connect(this.username);
    this.isLogged = true;
  }

  send(): void {
    const valid =
      this.messageText.trim().length > 0 && this.socketSvc.isConnected();
    if (!valid) return;

    this.socketSvc.sendMessage(this.messageText);
    this.messageText = '';
  }

  trackByTs(_i: number, m: ChatMessage) {
    return m.timestamp;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const box = document.getElementById('chatBox');
      if (box) box.scrollTop = box.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
