import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8082/api/agents';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/all-clients`);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/get-client/${id}`);
  }

  createClient(client: Client, mdp: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/create-client?mdp=${mdp}`,
      client,
      { responseType: 'text' }
    );
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/update-client`, client);
  }

  deleteClient(id: string): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/delete-client/${id}`,
      { responseType: 'text' }
    );
  }
}
