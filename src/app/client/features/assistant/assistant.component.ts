import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../../core/services/assistant.service';

interface ChatMessage {
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userMessage = '';
  conversation: ChatMessage[] = [];
  isLoading = false;

  constructor(private assistantService: AssistantService) {
    // Message de bienvenue
    this.conversation.push({
      sender: 'assistant',
      message: 'Bonjour ! Je suis votre assistant bancaire IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.isLoading) return;

    const userQuery = this.userMessage.trim();
    
    // Ajouter le message utilisateur
    this.conversation.push({
      sender: 'user',
      message: userQuery,
      timestamp: new Date()
    });

    this.userMessage = '';
    this.isLoading = true;

    // Appeler le backend IA
    this.assistantService.askBank(userQuery).subscribe({
      next: (response) => {
        this.conversation.push({
          sender: 'assistant',
          message: response,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur IA:', error);
        this.conversation.push({
          sender: 'assistant',
          message: '❌ Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  // Permettre l'envoi avec Entrée
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}