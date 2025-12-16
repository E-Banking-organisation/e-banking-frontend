import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faExchangeAlt, faPlus, faEdit, faTrash,
  faHistory, faCheck, faStar, faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { Account } from '../../core/models/account.model';
import { Beneficiary } from '../../core/models/Beneficiary.model';
import { Transaction } from '../../core/models/transaction.model';
import { VirementService } from '../../core/services/virement.service';
import { AccountService } from '../../core/services/account.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './virement.component.html',
  styleUrl: './virement.component.css'
})
export class VirementComponent implements OnInit {
// Icônes
  faExchangeAlt = faExchangeAlt;
  faPlus = faPlus;
  faTrash = faTrash;
  faHistory = faHistory;
  faStar = faStar;
  faUserPlus = faUserPlus;

  // États d'affichage
  activeTab: 'new-transfer' | 'beneficiaries' | 'history' = 'new-transfer';
  showNewBeneficiary = false;
  showOtpVerification = false;

  // Données
  accounts: Account[] = [];
  beneficiaries: Beneficiary[] = [];
  transfers: Transaction[] = [];

  // Formulaire de virement
  transferForm = {
    sourceAccountId: 0,
    beneficiaryId: 0,
    amount: 0,
    description: ''
  };

  // Formulaire de bénéficiaire
  beneficiaryForm: Beneficiary = {
    id: 0,
    name: '',
    accountNumber: '',
    client_id: 5,
    favorite: false,
    beneficiare_id: 0
  };

  // Code OTP
  otpCode: string = '';

  // Variables de pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  paginatedTransfers: Transaction[] = [];

  constructor(private virementService: VirementService) {}

  ngOnInit(): void {
    // Charger les données depuis le service
    this.virementService.getAccounts().subscribe({
      next: (accounts) => {
        console.log('Comptes chargés dans VirementComponent:', accounts);
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.accounts = []; // En cas d'erreur, s'assurer que accounts est un tableau vide
      }
    });

    this.beneficiaries = this.virementService.getBeneficiaries();
    this.transfers = this.virementService.getTransfers();

    // S'abonner aux changements
    this.virementService.beneficiaries$.subscribe(beneficiaries => {
      this.beneficiaries = beneficiaries;
    });

    this.virementService.transfers$.subscribe(transfers => {
      this.transfers = transfers;
      this.updatePagination();
    });

    this.updatePagination();
  }

  toggleNewBeneficiaryForm(isNewBeneficiary = true): void {
    this.showNewBeneficiary = !this.showNewBeneficiary;
    if (this.showNewBeneficiary && isNewBeneficiary) {
      this.resetBeneficiaryForm();
    }
  }

  resetBeneficiaryForm(): void {
    this.beneficiaryForm = {
      id: 0,
      name: '',
      accountNumber: '',
      client_id: 5,
      favorite: false, // Initialisation explicite
      beneficiare_id: 0
    };
  }

  saveBeneficiary(): void {
      this.virementService.addBeneficiary({...this.beneficiaryForm}).subscribe({
        next: (success) => {
          if (success) {
            this.beneficiaries=this.virementService.getBeneficiaries();
            this.showNewBeneficiary = false;
            this.activeTab = 'beneficiaries';
          }
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de l\'ajout');
        }
      });
  }

  deleteBeneficiary(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?')) {
      this.virementService.deleteBeneficiary(id).subscribe({
        next: (success) => {
          if (success) {
            this.beneficiaries=this.virementService.getBeneficiaries();
            this.activeTab = 'new-transfer';
          } else {
            alert('Échec du virement. Veuillez réessayer.');
          }
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur réseau. Veuillez réessayer.');
        }
      });
    }
    }

  toggleFavorite(beneficiary: Beneficiary): void {
    this.virementService.toggleFavorite(beneficiary).subscribe({
      next: (success) => {
        if (success) {
          this.beneficiaries=this.virementService.getBeneficiaries();
          this.activeTab = 'beneficiaries';
        } else {
          alert('Échec du virement. Veuillez réessayer.');
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur réseau. Veuillez réessayer.');
      }
    });
  }

  // Gestion du virement
  initiateTransfer(): void {
    if (!this.transferForm.sourceAccountId || !this.transferForm.beneficiaryId || this.transferForm.amount <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    this.showOtpVerification = true;
  }

  verifyAndSendTransfer(): void {
    // 2. Ensuite envoyer à l'API
    this.virementService.executeTransfer(this.transferForm,this.otpCode).subscribe({
      next: (success) => {
        if (success) {
          this.resetForm();
          this.transfers = this.virementService.getTransfers();
          this.activeTab = 'history';
        } else {
          alert('Échec du modification. Veuillez réessayer.');
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur réseau. Veuillez réessayer.');
      }
    });
  }

  private resetForm(): void {
    this.showOtpVerification = false;
    this.otpCode = '';
    this.transferForm = {
      sourceAccountId: 0,
      beneficiaryId: 0,
      amount: 0,
      description: ''
    };
  }

  cancelOtp(): void {
    this.showOtpVerification = false;
    this.otpCode = '';
  }

  // Helpers
  getBeneficiaryName(id: number): string {
    return this.virementService.getBeneficiaryName(id);
  }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.transfers.length / this.pageSize);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.transfers.length);
    this.paginatedTransfers = this.transfers.slice(startIndex, endIndex);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}
