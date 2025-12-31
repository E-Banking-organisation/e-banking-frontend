import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClientManagementComponent } from './client-management.component';
import { ClientService } from '../../core/services/client.service';

xdescribe('ClientManagementComponent', () => {
  let component: ClientManagementComponent;
  let fixture: ComponentFixture<ClientManagementComponent>;
  let clientService: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    const clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'getClients',
      'getClientById',
      'createClient',
      'updateClient',
      'deleteClient'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ClientManagementComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy }
      ]
    }).compileComponents();

    clientService = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    clientService.getClients.and.returnValue(of([]));

    fixture = TestBed.createComponent(ClientManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', () => {
    expect(clientService.getClients).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should filter clients by search query', () => {
    component.clients = [
      { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@test.com', status: 'active' },
      { id: '2', firstName: 'Marie', lastName: 'Martin', email: 'marie@test.com', status: 'active' }
    ];

    component.searchQuery = 'jean';
    component.onSearch();

    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].firstName).toBe('Jean');
  });
});
