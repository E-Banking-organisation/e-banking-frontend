import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-quick-action',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quick-action-card">
      <div class="icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
      <button class="action-button" (click)="navigateToAction()">Accéder</button>
    </div>
  `,
  styleUrls: ['./agent-quick-action.component.css']
})
export class AgentQuickActionComponent {
  @Input() type: 'clients' | 'accounts' | 'enrollment' = 'clients';

  constructor(private router: Router) {}

  get icon(): string {
    switch (this.type) {
      case 'clients': return '👥';
      case 'accounts': return '💳';
      case 'enrollment': return '📝';
      default: return '⚡';
    }
  }

  get title(): string {
    switch (this.type) {
      case 'clients': return 'Gestion Clients';
      case 'accounts': return 'Gestion Comptes';
      case 'enrollment': return 'Demandes d\'inscription';
      default: return 'Action Rapide';
    }
  }

  navigateToAction(): void {
    switch (this.type) {
      case 'clients':
        this.router.navigate(['/agent/clients']);
        break;
      case 'accounts':
        this.router.navigate(['/agent/subscribers']);
        break;
      case 'enrollment':
        this.router.navigate(['/agent/enrollments']);
        break;
    }
  }
}