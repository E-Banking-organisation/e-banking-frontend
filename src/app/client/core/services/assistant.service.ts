import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const ASK_BANK = gql`
  mutation AskBank($question: String!) {
    askBank(question: $question)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  constructor(private apollo: Apollo) {}

  /**
   * Envoie une question au chatbot IA bancaire
   */
  askBank(question: string): Observable<string> {
    const aiClient = this.apollo.use('ai');
    
    if (!aiClient) {
      console.error('Apollo client "ai" non trouvé !');
      return of('Service IA non disponible. Veuillez réessayer plus tard.');
    }

    return aiClient.mutate<{ askBank: string }>({
      mutation: ASK_BANK,
      variables: { question }
    }).pipe(
      map(result => result.data?.askBank || 'Aucune réponse reçue.'),
      catchError(error => {
        console.error('Erreur IA:', error);
        return of('Erreur de connexion au service IA. Veuillez réessayer.');
      })
    );
  }

  /**
   * Alias pour compatibilité avec le code existant
   */
  processMessage(message: string): Observable<string> {
    return this.askBank(message);
  }
}