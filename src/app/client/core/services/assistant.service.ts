import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  processMessage(message: string): Observable<string> {
    const msg = message.toLowerCase();

    if (msg.includes('solde')) {
      return of('Vous pouvez consulter votre solde dans la section Comptes.');
    }

    if (msg.includes('virement')) {
      return of('Les virements sont disponibles depuis le menu Virements.');
    }

    if (msg.includes('budget')) {
      return of('Votre budget mensuel est visible dans l’onglet Budget.');
    }

    return of('Assistant mock actif 🤖 (backend désactivé)');
  }
}
