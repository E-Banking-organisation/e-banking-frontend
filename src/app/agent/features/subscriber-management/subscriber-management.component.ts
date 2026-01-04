// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SubscriberService } from '../../core/services/subscriber.service';
// import { Subscriber, SubscriberAccount } from '../../core/models/subscriber.model';
//
// @Component({
//   selector: 'app-subscriber-management',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './subscriber-management.component.html',
//   styleUrl: './subscriber-management.component.css'
// })
//export class SubscriberManagementComponent implements OnInit {
  // subscribers: Subscriber[] = [];
  // filteredSubscribers: Subscriber[] = [];
  // selectedSubscriber: Subscriber | null = null;

  // // Filters and search
  // searchQuery: string = '';
  // statusFilter: string = 'all';
  // subscriptionTypeFilter: string = 'all';

  // isLoading = true;

  // constructor(private subscriberService: SubscriberService) {}

  // ngOnInit(): void {
  //   this.loadSubscribers();
  // }

  // loadSubscribers(): void {
  //   this.isLoading = true;
  //   this.subscriberService.getSubscribers().subscribe(
  //     subscribers => {
  //       this.subscribers = subscribers;
  //       this.applyFilters();
  //       this.isLoading = false;
  //     },
  //     error => {
  //       console.error('Error loading subscribers:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // onSearch(): void {
  //   this.applyFilters();
  // }

  // applyFilters(): void {
  //   let result = [...this.subscribers];

  //   // Apply search query if any
  //   if (this.searchQuery && this.searchQuery.trim() !== '') {
  //     const query = this.searchQuery.toLowerCase().trim();
  //     result = result.filter(subscriber =>
  //       subscriber.firstName.toLowerCase().includes(query) ||
  //       subscriber.lastName.toLowerCase().includes(query) ||
  //       subscriber.email.toLowerCase().includes(query) ||
  //       subscriber.id.toLowerCase().includes(query) ||
  //       subscriber.subscriptionId.toLowerCase().includes(query)
  //     );
  //   }

  //   // Apply status filter if not 'all'
  //   if (this.statusFilter !== 'all') {
  //     result = result.filter(subscriber => subscriber.subscriptionStatus === this.statusFilter);
  //   }

  //   // Apply type filter if not 'all'
  //   if (this.subscriptionTypeFilter !== 'all') {
  //     result = result.filter(subscriber => subscriber.subscriptionType === this.subscriptionTypeFilter);
  //   }

  //   this.filteredSubscribers = result;
  // }

  // viewSubscriber(id: string): void {
  //   const subscriber = this.subscribers.find(s => s.id === id);
  //   if (subscriber) {
  //     this.selectedSubscriber = { ...subscriber };
  //   }
  // }

  // closeModal(): void {
  //   this.selectedSubscriber = null;
  // }

  // activateSubscription(id: string): void {
  //   if (confirm('Êtes-vous sûr de vouloir activer cet abonnement?')) {
  //     this.subscriberService.updateSubscriptionStatus(id, 'active').subscribe(
  //       updatedSubscriber => {
  //         if (updatedSubscriber) {
  //           // Update the local list
  //           this.subscribers = this.subscribers.map(s =>
  //             s.id === id ? updatedSubscriber : s
  //           );
  //           this.applyFilters();

  //           // Update selected subscriber if currently viewing
  //           if (this.selectedSubscriber && this.selectedSubscriber.id === id) {
  //             this.selectedSubscriber = { ...updatedSubscriber };
  //           }
  //         }
  //       },
  //       error => console.error('Error activating subscription:', error)
  //     );
  //   }
  // }

  // suspendSubscription(id: string): void {
  //   if (confirm('Êtes-vous sûr de vouloir suspendre cet abonnement?')) {
  //     this.subscriberService.updateSubscriptionStatus(id, 'cancelled').subscribe(
  //       updatedSubscriber => {
  //         if (updatedSubscriber) {
  //           // Update the local list
  //           this.subscribers = this.subscribers.map(s =>
  //             s.id === id ? updatedSubscriber : s
  //           );
  //           this.applyFilters();

  //           // Update selected subscriber if currently viewing
  //           if (this.selectedSubscriber && this.selectedSubscriber.id === id) {
  //             this.selectedSubscriber = { ...updatedSubscriber };
  //           }
  //         }
  //       },
  //       error => console.error('Error suspending subscription:', error)
  //     );
  //   }
  // }

  // blockAccount(accountId: string): void {
  //   if (!this.selectedSubscriber) return;

  //   if (confirm('Êtes-vous sûr de vouloir bloquer ce compte?')) {
  //     // Find the subscriber that owns this account
  //     const subscriberId = this.selectedSubscriber.id;

  //     this.subscriberService.updateAccountStatus(subscriberId, accountId, 'blocked').subscribe(
  //       updatedAccount => {
  //         if (updatedAccount && this.selectedSubscriber) {
  //           // Update the selected subscriber's accounts
  //           this.selectedSubscriber.accounts = this.selectedSubscriber.accounts.map(a =>
  //             a.id === accountId ? updatedAccount : a
  //           );

  //           // Also update the main subscribers array
  //           this.subscribers = this.subscribers.map(s => {
  //             if (s.id === subscriberId) {
  //               return {
  //                 ...s,
  //                 accounts: s.accounts.map(a =>
  //                   a.id === accountId ? updatedAccount : a
  //                 )
  //               };
  //             }
  //             return s;
  //           });
  //         }
  //       },
  //       error => console.error('Error blocking account:', error)
  //     );
  //   }
  // }

  // unblockAccount(accountId: string): void {
  //   if (!this.selectedSubscriber) return;

  //   if (confirm('Êtes-vous sûr de vouloir débloquer ce compte?')) {
  //     // Find the subscriber that owns this account
  //     const subscriberId = this.selectedSubscriber.id;

  //     this.subscriberService.updateAccountStatus(subscriberId, accountId, 'active').subscribe(
  //       updatedAccount => {
  //         if (updatedAccount && this.selectedSubscriber) {
  //           // Update the selected subscriber's accounts
  //           this.selectedSubscriber.accounts = this.selectedSubscriber.accounts.map(a =>
  //             a.id === accountId ? updatedAccount : a
  //           );

  //           // Also update the main subscribers array
  //           this.subscribers = this.subscribers.map(s => {
  //             if (s.id === subscriberId) {
  //               return {
  //                 ...s,
  //                 accounts: s.accounts.map(a =>
  //                   a.id === accountId ? updatedAccount : a
  //                 )
  //               };
  //             }
  //             return s;
  //           });
  //         }
  //       },
  //       error => console.error('Error unblocking account:', error)
  //     );
  //   }
  // }

  // toggleSubscriptionStatus(): void {
  //   if (!this.selectedSubscriber) return;

  //   const newStatus = this.selectedSubscriber.subscriptionStatus === 'active' ? 'cancelled' : 'active';
  //   const message = newStatus === 'active'
  //     ? 'Êtes-vous sûr de vouloir activer cet abonnement?'
  //     : 'Êtes-vous sûr de vouloir suspendre cet abonnement?';

  //   if (confirm(message)) {
  //     this.subscriberService.updateSubscriptionStatus(
  //       this.selectedSubscriber.id,
  //       newStatus as 'active' | 'expired' | 'cancelled'
  //     ).subscribe(
  //       updatedSubscriber => {
  //         if (updatedSubscriber) {
  //           // Update the selected subscriber
  //           this.selectedSubscriber = { ...updatedSubscriber };

  //           // Update the main subscribers array
  //           this.subscribers = this.subscribers.map(s =>
  //             s.id === updatedSubscriber.id ? updatedSubscriber : s
  //           );

  //           // Re-apply filters
  //           this.applyFilters();
  //         }
  //       },
  //       error => console.error('Error toggling subscription status:', error)
  //     );
  //   }
  // }

  // updateSubscriptionType(): void {
  //   if (!this.selectedSubscriber) return;

  //   const options = ['standard', 'premium', 'vip'];
  //   const currentIndex = options.indexOf(this.selectedSubscriber.subscriptionType);

  //   const selectElement = document.createElement('select');
  //   options.forEach(option => {
  //     const optElement = document.createElement('option');
  //     optElement.value = option;
  //     optElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
  //     if (option === this.selectedSubscriber?.subscriptionType) {
  //       optElement.selected = true;
  //     }
  //     selectElement.appendChild(optElement);
  //   });

  //   const result = prompt(
  //     'Choisissez un nouveau type d\'abonnement:',
  //     this.selectedSubscriber.subscriptionType
  //   );

  //   if (result && options.includes(result)) {
  //     this.subscriberService.updateSubscriptionType(
  //       this.selectedSubscriber.id,
  //       result as 'standard' | 'premium' | 'vip'
  //     ).subscribe(
  //       updatedSubscriber => {
  //         if (updatedSubscriber) {
  //           // Update the selected subscriber
  //           this.selectedSubscriber = { ...updatedSubscriber };

  //           // Update the main subscribers array
  //           this.subscribers = this.subscribers.map(s =>
  //             s.id === updatedSubscriber.id ? updatedSubscriber : s
  //           );

  //           // Re-apply filters
  //           this.applyFilters();
  //         }
  //       },
  //       error => console.error('Error updating subscription type:', error)
  //     );
  //   }
  // }
//}
