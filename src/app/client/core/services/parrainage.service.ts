import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filleul, ReglementParrainage } from '../models/Parrainage.model';

@Injectable({
  providedIn: 'root'
})
export class ParrainageService {

  private filleuls: Filleul[] = [
    { id: '1', nom: 'Sophie Martin', email: 'sophie@example.com', dateInscription: '2023-09-15', statut: 'Activé', bonus: '10 €' },
    { id: '2', nom: 'Lucas Dubois', email: 'lucas@example.com', dateInscription: '2023-09-18', statut: 'En attente', bonus: '5 €' },
    { id: '3', nom: 'Emma Bernard', email: 'emma@example.com', dateInscription: '2023-09-20', statut: 'Prime accordée', bonus: '10 €' }
  ];

  getCodeParrainage(userId: string): Observable<string> {
    return of(`${userId}-XYZ123`);
  }

  getLienParrainage(code: string): string {
    return `${window.location.origin}/inscription?ref=${code}`;
  }

  getFilleuls(): Observable<Filleul[]> {
    return of(this.filleuls);
  }

  getReglementParrainage(): Observable<ReglementParrainage> {
    return of({
      maxFilleulsParMois: 10,
      montantMaxRecompenses: '100 €',
      conditions: [
        'Seuls les nouveaux comptes sont éligibles',
        'Le filleul doit effectuer au moins une transaction',
        'La prime est accordée après validation du compte'
      ]
    });
  }

  calculerTotalGains(filleuls: Filleul[]): number {
    return filleuls
      .filter(f => f.statut === 'Prime accordée' || f.statut === 'Activé')
      .reduce((sum, f) => sum + parseFloat(f.bonus.replace(' €', '').replace(',', '.')), 0);
  }
}
