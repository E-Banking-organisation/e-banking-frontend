import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  // This is a mock service for demonstration
  private mockEnrollments: Enrollment[] = [
    {
      id: 'enr001',
      client: {
        id: 'client123',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33123456789',
        address: '123 Rue de Paris, Paris',
        nationalId: 'FR123456789',
        dateOfBirth: new Date('1985-05-15'),
        status: 'pending'
      },
      status: 'pending',
      dateCreated: new Date('2023-04-15')
    },
    {
      id: 'enr002',
      client: {
        id: 'client456',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '+33987654321',
        address: '456 Avenue de Lyon, Lyon',
        nationalId: 'FR987654321',
        dateOfBirth: new Date('1990-08-22'),
        status: 'active'
      },
      status: 'approved',
      dateCreated: new Date('2023-04-10'),
      dateProcessed: new Date('2023-04-12'),
      processedByAgentId: 'agent001'
    },
    {
      id: 'enr003',
      client: {
        id: 'client789',
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@example.com',
        phone: '+33567891234',
        address: '789 Boulevard de Marseille, Marseille',
        nationalId: 'FR567891234',
        dateOfBirth: new Date('1975-11-30'),
        status: 'pending'
      },
      status: 'rejected',
      dateCreated: new Date('2023-04-05'),
      dateProcessed: new Date('2023-04-06'),
      processedByAgentId: 'agent002',
      rejectionReason: 'Information insuffisante'
    }
  ];

  constructor(private http: HttpClient) { }

  getEnrollments(): Observable<Enrollment[]> {
    // In a real app, this would call an API
    // return this.http.get<Enrollment[]>('/api/enrollments');
    
    // For now, return mock data
    return of(this.mockEnrollments);
  }

  getEnrollmentById(id: string): Observable<Enrollment | undefined> {
    const enrollment = this.mockEnrollments.find(e => e.id === id);
    return of(enrollment);
  }

  createEnrollment(enrollment: Omit<Enrollment, 'id'>): Observable<Enrollment> {
    // In a real app, this would call an API
    // return this.http.post<Enrollment>('/api/enrollments', enrollment);
    
    // For now, create a mock enrollment with a generated ID
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: 'enr' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    };
    this.mockEnrollments.push(newEnrollment);
    return of(newEnrollment);
  }

  updateEnrollmentStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected', 
    agentId?: string, 
    rejectionReason?: string
  ): Observable<Enrollment | undefined> {
    // In a real app, this would call an API
    // return this.http.patch<Enrollment>(`/api/enrollments/${id}/status`, { status, agentId, rejectionReason });
    
    // For now, update the mock enrollment
    const index = this.mockEnrollments.findIndex(e => e.id === id);
    if (index !== -1) {
      const updatedEnrollment = { 
        ...this.mockEnrollments[index], 
        status,
        dateProcessed: status !== 'pending' ? new Date() : undefined,
        processedByAgentId: status !== 'pending' ? agentId : undefined,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined
      };
      this.mockEnrollments[index] = updatedEnrollment;
      return of(updatedEnrollment);
    }
    return of(undefined);
  }
}