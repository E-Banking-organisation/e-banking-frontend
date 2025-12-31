import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberManagementComponent } from './subscriber-management.component';

xdescribe('SubscriberManagementComponent', () => {
  let component: SubscriberManagementComponent;
  let fixture: ComponentFixture<SubscriberManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriberManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
