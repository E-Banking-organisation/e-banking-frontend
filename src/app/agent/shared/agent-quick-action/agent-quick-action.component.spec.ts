import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentQuickActionComponent } from './agent-quick-action.component';

xdescribe('AgentQuickActionComponent', () => {
  let component: AgentQuickActionComponent;
  let fixture: ComponentFixture<AgentQuickActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentQuickActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentQuickActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
