import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.css'
})
export class ClientManagementComponent implements OnInit {
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);

  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

  searchQuery: string = '';
  statusFilter: string = 'all';

  clientForm: FormGroup;
  showClientModal: boolean = false;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  isLoading: boolean = true;
  activeDropdown: string | null = null;

  constructor() {
    this.clientForm = this.createClientForm();
  }

  createClientForm(): FormGroup {
    return this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      nationalId: [''],
      dateOfBirth: [''],
      status: ['active']
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients().subscribe(
      (clients: Client[]) => {
        this.clients = clients;
        this.applyFilters();
        this.isLoading = false;
      },
      error => {
        console.error('Error loading clients:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.clients];

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(client =>
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        (client.phone && client.phone.includes(query)) ||
        (client.nationalId && client.nationalId.toLowerCase().includes(query))
      );
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(client => client.status === this.statusFilter);
    }

    this.filteredClients = result;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  showAddClientModal(): void {
    this.isEditMode = false;
    this.clientForm.reset({ status: 'active' });
    this.showClientModal = true;
  }

  editClient(client: Client): void {
    this.isEditMode = true;
    this.clientForm.patchValue(client);

    if (client.dateOfBirth) {
      const date = new Date(client.dateOfBirth);
      this.clientForm.patchValue({
        dateOfBirth: date.toISOString().split('T')[0]
      });
    }

    this.showClientModal = true;
    this.selectedClient = null;
  }

  viewClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe(
      client => {
        if (client) {
          this.selectedClient = client;
        }
      },
      error => console.error('Error loading client details:', error)
    );
  }

  closeModal(): void {
    this.showClientModal = false;
  }

  closeClientDetails(): void {
    this.selectedClient = null;
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      Object.keys(this.clientForm.controls).forEach(field => {
        const control = this.clientForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const clientData = this.clientForm.value;

    if (this.isEditMode) {
      const clientId = clientData.id;
      this.clientService.updateClient(clientId, clientData).subscribe(
        updatedClient => {
          if (updatedClient) {
            this.clients = this.clients.map(c => c.id === clientId ? updatedClient : c);
            this.applyFilters();
            this.showClientModal = false;
          }
          this.isSubmitting = false;
        },
        error => {
          console.error('Error updating client:', error);
          this.isSubmitting = false;
        }
      );
    } else {
      // Suppression de la variable 'id' non utilisée
      this.clientService.createClient(clientData).subscribe(
        newClient => {
          this.clients.push(newClient);
          this.applyFilters();
          this.showClientModal = false;
          this.isSubmitting = false;
        },
        error => {
          console.error('Error creating client:', error);
          this.isSubmitting = false;
        }
      );
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  activateClient(clientId: string): void {
    if (confirm('Êtes-vous sûr de vouloir activer ce client?')) {
      this.updateClientStatus(clientId, 'active');
    }
  }

  suspendClient(clientId: string): void {
    if (confirm('Êtes-vous sûr de vouloir suspendre ce client?')) {
      this.updateClientStatus(clientId, 'suspended');
    }
  }

  deleteClient(clientId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client? Cette action est irréversible.')) {
      this.clientService.deleteClient(clientId).subscribe(
        success => {
          if (success) {
            this.clients = this.clients.filter(c => c.id !== clientId);
            this.applyFilters();
          }
        },
        error => console.error('Error deleting client:', error)
      );
    }
  }

  private updateClientStatus(clientId: string, status: 'active' | 'pending' | 'suspended' | 'closed'): void {
    this.clientService.updateClient(clientId, { status }).subscribe(
      updatedClient => {
        if (updatedClient) {
          this.clients = this.clients.map(c => c.id === clientId ? updatedClient : c);
          this.applyFilters();

          if (this.selectedClient && this.selectedClient.id === clientId) {
            this.selectedClient = updatedClient;
          }
        }
      },
      error => console.error(`Error updating client status to ${status}:`, error)
    );
  }

  toggleDropdown(clientId: string): void {
    if (this.activeDropdown === clientId) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = clientId;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.activeDropdown = null;
    }
  }
}
