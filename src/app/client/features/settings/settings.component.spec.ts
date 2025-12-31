import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../core/services/settings.service';

xdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    const settingsServiceSpy = jasmine.createSpyObj('SettingsService', [
      'getClientData',
      'updateClientData',
      'updatePassword'
    ]);

    await TestBed.configureTestingModule({
      imports: [SettingsComponent, ReactiveFormsModule],
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy }
      ]
    }).compileComponents();

    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    settingsService.getClientData.and.returnValue(of({
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      CIN: 'cin123456',
      address: 'address 1',
      phone: '0600000000',
      birthday: new Date('1990-01-01'),
      profession: 'Engineer',
      Accounts: [],
      dateCreated: new Date('2020-01-01'),
      password: 'hashedpassword',
      role: 'client',
      twoFactorEnabled: false
    }));

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
