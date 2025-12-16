import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../../core/services/assistant.service';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent {
  userMessage: string = '';
  conversation: { sender: 'user' | 'assistant'; message: string; timestamp: Date }[] = [];
  isLoading: boolean = false;

  constructor(private assistantService: AssistantService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Ajouter le message utilisateur à la conversation
    this.conversation.push({
      sender: 'user',
      message: this.userMessage,
      timestamp: new Date()
    });

    const userQuery = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    // Envoyer le message au backend via AssistantService
    this.assistantService.processMessage(userQuery).subscribe({
      next: (response) => {
        this.conversation.push({
          sender: 'assistant',
          message: response,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du traitement du message:', error);
        this.conversation.push({
          sender: 'assistant',
          message: 'Un problème est survenu, veuillez essayer ultérieurement.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }
}
