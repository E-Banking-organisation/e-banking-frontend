import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Enrollment } from '../../core/models/enrollment.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  enrollments: Enrollment[] = [];
  selectedEnrollment: Enrollment | null = null;
  isLoading = true;
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
  searchTerm = '';

    private enrollmentService = inject(EnrollmentService);

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.enrollmentService.getEnrollments().subscribe(
      data => {
        this.enrollments = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching enrollments:', error);
        this.isLoading = false;
      }
    );
  }

  viewEnrollmentDetails(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
  }

  closeDetails(): void {
    this.selectedEnrollment = null;
  }

  approveEnrollment(enrollment: Enrollment): void {
    if (confirm('Êtes-vous sûr de vouloir approuver cette demande d\'inscription ?')) {
      this.enrollmentService.updateEnrollmentStatus(enrollment.id, 'approved', 'current-agent-id').subscribe(
        updatedEnrollment => {
          if (updatedEnrollment) {
            const index = this.enrollments.findIndex(e => e.id === enrollment.id);
            if (index !== -1) {
              this.enrollments[index] = updatedEnrollment;
              this.selectedEnrollment = updatedEnrollment;
            }
          }
        },
        error => console.error('Error approving enrollment:', error)
      );
    }
  }

  rejectEnrollment(enrollment: Enrollment, reason: string): void {
    if (!reason || reason.trim() === '') {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    this.enrollmentService.updateEnrollmentStatus(enrollment.id, 'rejected', 'current-agent-id', reason).subscribe(
      updatedEnrollment => {
        if (updatedEnrollment) {
          const index = this.enrollments.findIndex(e => e.id === enrollment.id);
          if (index !== -1) {
            this.enrollments[index] = updatedEnrollment;
            this.selectedEnrollment = updatedEnrollment;
          }
        }
      },
      error => console.error('Error rejecting enrollment:', error)
    );
  }

  getFilteredEnrollments(): Enrollment[] {
    return this.enrollments.filter(enrollment => {
      // Apply status filter
      if (this.statusFilter !== 'all' && enrollment.status !== this.statusFilter) {
        return false;
      }

      // Apply search filter
      if (this.searchTerm.trim() !== '') {
        const search = this.searchTerm.toLowerCase();
        const client = enrollment.client;
        return (
          client.firstName.toLowerCase().includes(search) ||
          client.lastName.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search) ||
          (client.phone && client.phone.includes(search))
        );
      }

      return true;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return status;
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
