import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { SubscriberService } from '../../core/services/subscriber.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalClients: number = 156;
  activeAccounts: number = 243;
  newClients: number = 28;
  pendingEnrollments: number = 12;

  constructor(
    private clientService: ClientService,
    // private subscriberService: SubscriberService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Mock data for demonstration
    this.totalClients = 156;
    this.activeAccounts = 243;
    this.newClients = 28;
    this.pendingEnrollments = 12;

    // In a real application, fetch data from services
  }
}
