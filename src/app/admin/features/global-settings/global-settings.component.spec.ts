import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { GlobalSettingsComponent } from './global-settings.component';

describe('GlobalSettingsComponent', () => {
  let component: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSettingsComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
