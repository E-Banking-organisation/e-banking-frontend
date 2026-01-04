import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
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

  clientForm: FormGroup;
  showClientModal = false;
  isEditMode = false;
  isSubmitting = false;

  password = '';
  searchQuery = ''; // <-- ajouté

  constructor() {
    this.clientForm = this.fb.group({
      id: [null],
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
    this.clientService.getClients().subscribe({
      next: data => {
        this.clients = data;
        this.filteredClients = data;
      },
      error: err => console.error(err)
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.id?.toLowerCase().includes(query)
    );
  }

  viewClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: client => this.selectedClient = client,
      error: err => console.error(err)
    });
  }

  showAddClientModal(): void {
    this.isEditMode = false;
    this.password = '';
    this.clientForm.reset({ status: 'active' });
    this.showClientModal = true;
  }

  editClient(client: Client): void {
    this.isEditMode = true;
    this.clientForm.patchValue(client);
    this.showClientModal = true;
  }

  saveClient(): void {
    if (this.clientForm.invalid) return;

    this.isSubmitting = true;
    const client: Client = this.clientForm.value;

    if (this.isEditMode) {
      this.clientService.updateClient(client).subscribe({
        next: () => {
          this.loadClients();
          this.showClientModal = false;
          this.isSubmitting = false;
        },
        error: err => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.clientService.createClient(client, this.password).subscribe({
        next: () => {
          this.loadClients();
          this.showClientModal = false;
          this.isSubmitting = false;
        },
        error: err => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteClient(clientId: string): void {
    if (!confirm('Supprimer ce client ?')) return;

    this.clientService.deleteClient(clientId).subscribe({
      next: () => this.loadClients(),
      error: err => console.error(err)
    });
  }

  closeModal(): void {
    this.showClientModal = false;
  }

  closeClientDetails(): void {
    this.selectedClient = null;
  }
}
