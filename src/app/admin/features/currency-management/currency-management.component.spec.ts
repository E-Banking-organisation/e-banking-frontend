import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CurrencyManagementComponent } from './currency-management.component';

xdescribe('CurrencyManagementComponent', () => {
  let component: CurrencyManagementComponent;
  let fixture: ComponentFixture<CurrencyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyManagementComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
