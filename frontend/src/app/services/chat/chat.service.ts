import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	private chatSocket = io('/api/chat-socket', {
		path: '/api/chat-socket/socket.io',
		// TO DO : add auth details (cookie or token)
		// auth: {
		// 	token: localStorage.
		// },
	});

	constructor() { };

	sendMessage(message: string): void {
		this.chatSocket.emit('message', message);
	}

	getMessages(): Observable<string> {
		return new Observable((observer) => {
			this.chatSocket.on('message', (message) => {
				observer.next(message);
			});
		});
	}
}
