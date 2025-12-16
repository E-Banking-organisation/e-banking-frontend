import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);

  private mockClients: Client[] = [
    {
      id: "client123",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      phone: "+33123456789",
      address: "123 Rue de Paris, Paris",
      nationalId: "FR123456789",
      dateOfBirth: new Date("1985-05-15"),
      status: "active"
    },
    {
      id: "client456",
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@example.com",
      phone: "+33987654321",
      address: "456 Avenue de Lyon, Lyon",
      nationalId: "FR987654321",
      dateOfBirth: new Date("1990-08-22"),
      status: "pending"
    }
  ];

  getClients(): Observable<Client[]> {
    return of(this.mockClients);
  }

  getClientById(id: string): Observable<Client | undefined> {
    const client = this.mockClients.find(c => c.id === id);
    return of(client);
  }

  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    const newClient: Client = {
      ...client,
      id: 'client' + Math.floor(Math.random() * 1000)
    };
    this.mockClients.push(newClient);
    return of(newClient);
  }

  updateClient(id: string, updates: Partial<Client>): Observable<Client | undefined> {
    const index = this.mockClients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockClients[index] = { ...this.mockClients[index], ...updates };
      return of(this.mockClients[index]);
    }
    return of(undefined);
  }

  deleteClient(id: string): Observable<boolean> {
    const initialLength = this.mockClients.length;
    this.mockClients = this.mockClients.filter(c => c.id !== id);
    return of(this.mockClients.length < initialLength);
  }
}
