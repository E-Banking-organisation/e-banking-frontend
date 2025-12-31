import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AgentSidebarComponent } from './agent-sidebar.component';

xdescribe('AgentSidebarComponent', () => {
  let component: AgentSidebarComponent;
  let fixture: ComponentFixture<AgentSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentSidebarComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
