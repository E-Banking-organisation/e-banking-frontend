import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TransactionVerificationComponent } from './transaction-verification.component';

xdescribe('TransactionVerificationComponent', () => {
  let component: TransactionVerificationComponent;
  let fixture: ComponentFixture<TransactionVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionVerificationComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
