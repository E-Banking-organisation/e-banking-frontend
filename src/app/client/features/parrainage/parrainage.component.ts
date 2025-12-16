import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCopy,
  faEnvelope,
  faUsers,
  faCoins,
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Filleul, ReglementParrainage } from '../../core/models/Parrainage.model';
import { ParrainageService } from '../../core/services/parrainage.service';

@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.component.html',
  styleUrls: ['./parrainage.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    NgClass,
    NgIf
  ]
})
export class ParrainageComponent implements OnInit {
  // Font Awesome icons
  faCopy = faCopy;
  faEnvelope = faEnvelope;
  faWhatsapp = faWhatsapp;
  faUsers = faUsers;
  faCoins = faCoins;
  faInfoCircle = faInfoCircle;
  faCheckCircle = faCheckCircle;

  // Données du parrainage
  referralCode: string = '';
  referralLink: string = '';
  filleuls: Filleul[] = [];
  filleulsActifs: Filleul[] = [];
  totalGains: number = 0;
  reglement: ReglementParrainage = {
    maxFilleulsParMois: 0,
    montantMaxRecompenses: '0 €',
    conditions: []
  };

  // Notification
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationTimeout: any;

  constructor(private parrainageService: ParrainageService) {}

  ngOnInit(): void {
    // Simuler un utilisateur connecté
    const userId = '123456';

    // Récupérer le code de parrainage
    this.parrainageService.getCodeParrainage(userId).subscribe(code => {
      this.referralCode = code;
      this.referralLink = this.parrainageService.getLienParrainage(code);
    });

    // Récupérer les filleuls
    this.parrainageService.getFilleuls().subscribe(filleuls => {
      this.filleuls = filleuls;
      this.filleulsActifs = filleuls.filter(f => f.statut === 'Activé' || f.statut === 'Prime accordée');
      this.totalGains = this.parrainageService.calculerTotalGains(filleuls);
    });

    // Récupérer le règlement
    this.parrainageService.getReglementParrainage().subscribe(reglement => {
      this.reglement = reglement;
    });
  }

  /**
   * Copie le lien de parrainage dans le presse-papiers
   */
  copyLink(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.showNotificationMessage('Lien copié avec succès !');
  }

  /**
   * Partage le lien de parrainage par email
   */
  shareByEmail(): void {
    const subject = 'Rejoignez-moi sur E-Bank !';
    const body = `Bonjour, \n\nJe vous invite à rejoindre E-Bank en utilisant mon lien de parrainage : ${this.referralLink}\n\nÀ bientôt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /**
   * Partage le lien de parrainage par WhatsApp
   */
  shareByWhatsapp(): void {
    const message = `Rejoignez-moi sur E-Bank en utilisant mon lien de parrainage : ${this.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }

  /**
   * Obtient la classe CSS en fonction du statut du filleul
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente':
        return 'status-pending';
      case 'Activé':
        return 'status-active';
      case 'Prime accordée':
        return 'status-completed';
      default:
        return '';
    }
  }

  /**
   * Affiche un message de notification temporaire
   */
  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
