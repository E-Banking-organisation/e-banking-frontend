import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private http = inject(HttpClient);
  private agentUrl = 'http://localhost:8075/api/agents';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.agentUrl}/all-clients`);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.agentUrl}/get-client/${id}`);
  }

  createClient(client: Client, mdp: string): Observable<string> {
    return this.http.post(
      `${this.agentUrl}/create-client?mdp=${mdp}`,
      client,
      { responseType: 'text' }
    );
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.agentUrl}/update-client`, client);
  }

  deleteClient(id: string): Observable<string> {
    return this.http.delete(
      `${this.agentUrl}/delete-client/${id}`,
      { responseType: 'text' }
    );
  }
}
