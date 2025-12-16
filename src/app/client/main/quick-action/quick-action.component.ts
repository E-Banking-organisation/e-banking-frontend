import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-action',
  templateUrl: './quick-action.component.html',
  styleUrls: ['./quick-action.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QuickActionComponent {
  @Input() type: 'virement' | 'crypto' | 'recharge' = 'virement';

  constructor(private router: Router) {}

  get icon(): string {
    switch (this.type) {
      case 'virement': return '💸';
      case 'crypto': return '₿';
      case 'recharge': return '📱';
      default: return '⚡';
    }
  }

  get title(): string {
    switch (this.type) {
      case 'virement': return 'Faire un Virement';
      case 'crypto': return 'Acheter Crypto';
      case 'recharge': return 'Recharger Téléphone';
      default: return 'Action Rapide';
    }
  }

  navigateToAction(): void {
    switch (this.type) {
      case 'virement':
        this.router.navigate(['/client/virement']);
        break;
      case 'crypto':
        this.router.navigate(['/client/crypto']);
        break;
      case 'recharge':
        this.router.navigate(['/client/recharges']);
        break;
    }
  }
}