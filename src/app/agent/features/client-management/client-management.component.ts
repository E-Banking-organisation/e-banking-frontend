import { Component, OnInit, HostListener } from '@angular/core';
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
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

  // Filters
  searchQuery: string = '';
  statusFilter: string = 'all';

  // Form
  clientForm: FormGroup;
  showClientModal: boolean = false;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  isLoading: boolean = true;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.createClientForm();
  }

  ngOnInit(): void {
    this.loadClients();
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

    // Apply search query if any
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

    // Apply status filter if not 'all'
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
    this.clientForm.reset({status: 'active'});
    this.showClientModal = true;
  }

  editClient(client: Client): void {
    this.isEditMode = true;
    this.clientForm.patchValue(client);

    // Convert dateOfBirth to the format expected by input type="date"
    if (client.dateOfBirth) {
      const date = new Date(client.dateOfBirth);
      this.clientForm.patchValue({
        dateOfBirth: date.toISOString().split('T')[0]
      });
    }

    this.showClientModal = true;

    // If we were viewing client details, close that modal
    this.selectedClient = null;
  }

  viewClient(id: string): void {
    this.clientService.getClientById(id).subscribe(
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
      // Mark all fields as touched to display validation errors
      Object.keys(this.clientForm.controls).forEach(field => {
        const control = this.clientForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const clientData = this.clientForm.value;

    if (this.isEditMode) {
      // Update existing client
      const id = clientData.id;
      this.clientService.updateClient(id, clientData).subscribe(
        updatedClient => {
          if (updatedClient) {
            this.clients = this.clients.map(c => c.id === id ? updatedClient : c);
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
      // Create new client
      const { id, ...newClientData } = clientData; // Remove id as it will be generated
      this.clientService.createClient(newClientData).subscribe(
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

  activateClient(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir activer ce client?')) {
      this.updateClientStatus(id, 'active');
    }
  }

  suspendClient(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir suspendre ce client?')) {
      this.updateClientStatus(id, 'suspended');
    }
  }

  deleteClient(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client? Cette action est irréversible.')) {
      this.clientService.deleteClient(id).subscribe(
        success => {
          if (success) {
            this.clients = this.clients.filter(c => c.id !== id);
            this.applyFilters();
          }
        },
        error => console.error('Error deleting client:', error)
      );
    }
  }

  private updateClientStatus(id: string, status: 'active' | 'pending' | 'suspended' | 'closed'): void {
    this.clientService.updateClient(id, { status }).subscribe(
      updatedClient => {
        if (updatedClient) {
          this.clients = this.clients.map(c => c.id === id ? updatedClient : c);
          this.applyFilters();

          // Update selected client if open
          if (this.selectedClient && this.selectedClient.id === id) {
            this.selectedClient = updatedClient;
          }
        }
      },
      error => console.error(`Error updating client status to ${status}:`, error)
    );
  }
  activeDropdown: string | null = null;

  toggleDropdown(clientId: string): void {
    if (this.activeDropdown === clientId) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = clientId;
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: any): void {
    if (!event.target.closest('.dropdown')) {
      this.activeDropdown = null;
    }
  }
}
