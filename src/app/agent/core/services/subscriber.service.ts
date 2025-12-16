import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Subscriber, SubscriberAccount } from '../models/subscriber.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private subscribers: Subscriber[] = [
    {
      id: '1',
      firstName: 'Mohamed',
      lastName: 'El Alaoui',
      email: 'mohamed.elalaoui@example.com',
      phone: '0655123456',
      address: '15 Avenue Hassan II, Casablanca',
      nationalId: 'AB123456',
      dateOfBirth: new Date('1985-06-15'),
      status: 'active',
      subscriptionId: 'sub-001',
      subscriptionDate: new Date('2025-01-10'),
      subscriptionType: 'premium',
      subscriptionStatus: 'active',
      expirationDate: new Date('2026-01-10'),
      autoRenewal: true,
      accounts: [
        {
          id: 'acc-001',
          accountNumber: '90124578903214',
          type: 'courant',
          balance: 15000,
          currency: 'MAD',
          status: 'active',
          dateCreated: new Date('2025-01-10')
        },
        {
          id: 'acc-002',
          accountNumber: '90124578903215',
          type: 'epargne',
          balance: 50000,
          currency: 'MAD',
          status: 'active',
          dateCreated: new Date('2025-01-12')
        }
      ]
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Benali',
      email: 'fatima.benali@example.com',
      phone: '0622987654',
      address: '8 Rue Moulay Ismail, Rabat',
      nationalId: 'CD789012',
      dateOfBirth: new Date('1990-03-22'),
      status: 'active',
      subscriptionId: 'sub-002',
      subscriptionDate: new Date('2025-02-15'),
      subscriptionType: 'standard',
      subscriptionStatus: 'active',
      expirationDate: new Date('2026-02-15'),
      autoRenewal: false,
      accounts: [
        {
          id: 'acc-003',
          accountNumber: '90124578903216',
          type: 'courant',
          balance: 8000,
          currency: 'MAD',
          status: 'active',
          dateCreated: new Date('2025-02-15')
        }
      ]
    }
  ];

  private subscribersSubject = new BehaviorSubject<Subscriber[]>(this.subscribers);
  subscribers$ = this.subscribersSubject.asObservable();

  constructor() { }

  getSubscribers(): Observable<Subscriber[]> {
    return this.subscribers$.pipe(delay(500));
  }

  getSubscriberById(id: string): Observable<Subscriber | undefined> {
    const subscriber = this.subscribers.find(s => s.id === id);
    return of(subscriber).pipe(delay(300));
  }

  updateSubscriberStatus(id: string, status: 'active' | 'suspended' | 'closed'): Observable<Subscriber | undefined> {
    let updatedSubscriber: Subscriber | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === id) {
        updatedSubscriber = { ...s, status: status };
        return updatedSubscriber;
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(updatedSubscriber).pipe(delay(300));
  }

  updateSubscriptionStatus(id: string, subscriptionStatus: 'active' | 'expired' | 'cancelled'): Observable<Subscriber | undefined> {
    let updatedSubscriber: Subscriber | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === id) {
        updatedSubscriber = { ...s, subscriptionStatus: subscriptionStatus };
        return updatedSubscriber;
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(updatedSubscriber).pipe(delay(300));
  }

  updateSubscriptionType(id: string, subscriptionType: 'standard' | 'premium' | 'vip'): Observable<Subscriber | undefined> {
    let updatedSubscriber: Subscriber | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === id) {
        updatedSubscriber = { 
          ...s, 
          subscriptionType: subscriptionType,
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        };
        return updatedSubscriber;
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(updatedSubscriber).pipe(delay(300));
  }

  updateAutoRenewal(id: string, autoRenewal: boolean): Observable<Subscriber | undefined> {
    let updatedSubscriber: Subscriber | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === id) {
        updatedSubscriber = { ...s, autoRenewal: autoRenewal };
        return updatedSubscriber;
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(updatedSubscriber).pipe(delay(300));
  }

  addAccount(subscriberId: string, account: Omit<SubscriberAccount, 'id' | 'status' | 'dateCreated'>): Observable<SubscriberAccount | undefined> {
    let newAccount: SubscriberAccount | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === subscriberId) {
        newAccount = {
          ...account,
          id: `acc-${Date.now()}`,
          status: 'active',
          dateCreated: new Date()
        };
        
        return {
          ...s,
          accounts: [...s.accounts, newAccount]
        };
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(newAccount).pipe(delay(500));
  }

  updateAccountStatus(subscriberId: string, accountId: string, status: 'active' | 'blocked' | 'closed'): Observable<SubscriberAccount | undefined> {
    let updatedAccount: SubscriberAccount | undefined;
    
    this.subscribers = this.subscribers.map(s => {
      if (s.id === subscriberId) {
        const updatedAccounts = s.accounts.map(a => {
          if (a.id === accountId) {
            updatedAccount = { ...a, status: status };
            return updatedAccount;
          }
          return a;
        });
        
        return { ...s, accounts: updatedAccounts };
      }
      return s;
    });
    
    this.subscribersSubject.next(this.subscribers);
    return of(updatedAccount).pipe(delay(300));
  }

  searchSubscribers(query: string): Observable<Subscriber[]> {
    query = query.toLowerCase();
    const filteredSubscribers = this.subscribers.filter(sub => 
      sub.firstName.toLowerCase().includes(query) ||
      sub.lastName.toLowerCase().includes(query) ||
      sub.email.toLowerCase().includes(query) ||
      sub.phone?.includes(query) ||
      sub.nationalId?.toLowerCase().includes(query) ||
      sub.subscriptionId.toLowerCase().includes(query)
    );
    return of(filteredSubscribers).pipe(delay(300));
  }
}