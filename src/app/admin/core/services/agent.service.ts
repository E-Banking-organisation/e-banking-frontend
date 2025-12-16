import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Agent } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private agents: Agent[] = [
    {
      id: '1',
      nom: 'Martin',
      prenom: 'Alice',
      email: 'alice@example.com',
      role: 'AGENT',
      etat: 'ACTIVE',
      dateCreation: new Date('2023-01-01'),
      telephone: '0612345678',
      codeAgence: 'AG001',
      lastLogin: new Date(),
      branchName: 'Agence Casablanca'
    },
    {
      id: '2',
      nom: 'Durand',
      prenom: 'Bob',
      email: 'bob@example.com',
      role: 'SUPERVISOR',
      etat: 'INACTIVE',
      dateCreation: new Date('2023-02-15'),
      telephone: '0623456789',
      codeAgence: 'AG002'
    }
  ];

  constructor() {}

  getAllAgents(): Observable<Agent[]> {
    return of(this.agents);
  }

  getAgentById(id: string): Observable<Agent> {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) return throwError(() => new Error('Agent introuvable'));
    return of(agent);
  }

  createAgent(agent: Omit<Agent, 'id' | 'dateCreation'>): Observable<Agent> {
    const newAgent: Agent = {
      ...agent,
      id: (this.agents.length + 1).toString(),
      dateCreation: new Date()
    };
    this.agents.push(newAgent);
    return of(newAgent);
  }

  updateAgent(id: string, updates: Partial<Agent>): Observable<Agent> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error('Agent introuvable'));
    const updatedAgent = { ...this.agents[index], ...updates };
    this.agents[index] = updatedAgent;
    return of(updatedAgent);
  }

  deleteAgent(id: string): Observable<{ success: boolean }> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error('Agent introuvable'));
    this.agents.splice(index, 1);
    return of({ success: true });
  }

  updateAgentStatus(id: string, etat: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Observable<Agent> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error('Agent introuvable'));
    this.agents[index].etat = etat;
    return of(this.agents[index]);
  }

  resetAgentPassword(id: string): Observable<{ success: boolean }> {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) return throwError(() => new Error('Agent introuvable'));
    console.log(`Mock: réinitialisation du mot de passe pour ${agent.email}`);
    return of({ success: true });
  }
}
