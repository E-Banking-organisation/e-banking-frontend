import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentService } from '../../core/services/agent.service';
import { Agent } from '../../core/models/agent.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faKey, faUserCheck, faUserSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-agent-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.css']
})
export class AgentManagementComponent implements OnInit {
  agents: Agent[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  showForm: boolean = false;
  isEditing: boolean = false;
  currentAgentId: string | null = null;
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  agentForm: FormGroup;

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTimes = faTimes;
  faKey = faKey;
  faUserCheck = faUserCheck;
  faUserSlash = faUserSlash;

  constructor(
    private agentService: AgentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.agentForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      role: ['AGENT', Validators.required],
      etat: [true, Validators.required],
      codeAgence: ['', Validators.required],
      branchName: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && (user.role === 'ADMIN' || user.role === 'AGENT')) {
        this.loadAgents();
      } else {
        this.isLoading = false;
        this.errorMessage = 'You are not authorized to view agents';
        console.error('Unauthorized access attempt');
      }
    });
  }


  loadAgents(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.agentService.getAllAgents().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.isLoading = false;
        this.cdr.markForCheck(); // Optimize change detection
      },
      error: (error) => {
        console.error('Error loading agents:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
        this.errorMessage = error.status === 401
          ? 'Unauthorized: Please log in with an admin account.'
          : error.status === 403
            ? 'Forbidden: You lack permission to view agents.'
            : 'Failed to load agents. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault(); // Prevent default form submission
    console.log('ngSubmit or test button triggered, form value:', this.agentForm.value);
    console.log('Form valid:', this.agentForm.valid);
    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      console.log('Form invalid, all fields touched');
      return;
    }

    const formValue = this.agentForm.value;

    if (this.isEditing && this.currentAgentId) {
      // Update existing agent
      this.agentService.updateAgent(this.currentAgentId, formValue).subscribe({
        next: (updatedAgent) => {
          console.log('Agent updated:', updatedAgent);
          const index = this.agents.findIndex(a => a.id === this.currentAgentId);
          if (index !== -1 && updatedAgent) {
            this.agents[index] = updatedAgent;
          }
          this.resetForm();
          this.loadAgents();
        },
        error: (error) => console.error('Error updating agent:', error)
      });
    } else {
      // Create new agent
      this.agentService.createAgent(formValue).subscribe({
        next: (newAgent) => {
          console.log('Agent created:', newAgent);
          this.agents.push(newAgent);
          this.resetForm();
          this.loadAgents();
        },
        error: (error) => console.error('Error creating agent:', error)
      });
    }
  }
  onFormSubmit(event: Event): void {
    console.log('Form submit event triggered', event);
  }

  editAgent(agent: Agent): void {
    this.isEditing = true;
    this.showForm = true;
    this.currentAgentId = agent.id;
    Promise.resolve().then(() => {
      this.agentForm.patchValue({
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone,
        role: agent.role,
        etat: agent.etat,
        codeAgence: agent.codeAgence,
        branchName: agent.branchName
      });
      this.cdr.markForCheck();
    });
  }

  deleteAgent(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      this.agentService.deleteAgent(id).subscribe({
        next: (success) => {
          if (success) {
            this.agents = this.agents.filter(a => a.id !== id);
          }
        },
        error: (error) => console.error('Error deleting agent:', error)
      });
    }
  }

  resetPassword(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet agent ?')) {
      this.agentService.resetAgentPassword(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Le mot de passe a été réinitialisé et envoyé à l\'agent par email.');
          }
        },
        error: (error) => console.error('Error resetting password:', error)
      });
    }
  }

  updateAgentStatus(agent: Agent, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): void {
    if (confirm(`Êtes-vous sûr de vouloir ${newStatus === 'ACTIVE' ? 'activer' : newStatus === 'INACTIVE' ? 'désactiver' : 'suspendre'} cet agent ?`)) {
      this.agentService.updateAgentStatus(agent.id, newStatus).subscribe({
        next: (updatedAgent) => {
          const index = this.agents.findIndex(a => a.id === agent.id);
          if (index !== -1 && updatedAgent) {
            this.agents[index] = updatedAgent;
          }
        },
        error: (error) => console.error('Error updating agent status:', error)
      });
    }
  }

  resetForm(): void {
    this.agentForm.reset({ role: 'AGENT', etat: true });
    this.isEditing = false;
    this.currentAgentId = null;
    this.showForm = false;
  }

  toggleForm(): void {
    if (this.showForm && this.isEditing) {
      this.resetForm();
    } else {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      }
    }
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
  }

  getFilteredAgents(): Agent[] {
    let result = this.agents;

    // Filter by status if not "ALL"
    if (this.statusFilter !== 'ALL') {
      result = result.filter(agent => {
        if (this.statusFilter === 'ACTIVE') return agent.etat === true;
        if (this.statusFilter === 'INACTIVE') return agent.etat === false;
        if (this.statusFilter === 'SUSPENDED') return agent.etat === false; // Ajuster si le backend gère SUSPENDED
        return true;
      });
    }

    // Then filter by search term if any
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(agent =>
        agent.prenom.toLowerCase().includes(term) ||
        agent.nom.toLowerCase().includes(term) ||
        agent.email.toLowerCase().includes(term) ||
        (agent.telephone && agent.telephone.includes(term)) ||
        (agent.branchName && agent.branchName.toLowerCase().includes(term)) ||
        (agent.codeAgence && agent.codeAgence.toLowerCase().includes(term))
      );
    }

    return result;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleDateString();
  }
}
