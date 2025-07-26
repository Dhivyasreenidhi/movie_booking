import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-chat',
  imports:[CommonModule, FormsModule],
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css']
})
export class SupportChatComponent {
  showChat = false;
  inputMessage = '';
  unreadMessages = 0;
  
  messages = [
    { sender: 'agent', text: 'Hello! How can I help you today?' },
    { sender: 'user', text: 'I have a question about my booking' },
    { sender: 'agent', text: 'Sure, what would you like to know?' }
  ];

  toggleChat(): void {
    this.showChat = !this.showChat;
    if (this.showChat) {
      this.unreadMessages = 0;
    }
  }

  sendMessage(): void {
    if (!this.inputMessage.trim()) return;
    
    this.messages.push({ sender: 'user', text: this.inputMessage });
    this.inputMessage = '';
    
    // Simulate agent response
    setTimeout(() => {
      this.messages.push({ 
        sender: 'agent', 
        text: 'Thanks for your message. Our team will get back to you shortly.' 
      });
      
      if (!this.showChat) {
        this.unreadMessages++;
      }
    }, 2000);
  }
}