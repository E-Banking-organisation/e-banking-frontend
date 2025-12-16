import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParrainageComponent } from './parrainage.component';

describe('ParrainageComponent', () => {
  let component: ParrainageComponent;
  let fixture: ComponentFixture<ParrainageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParrainageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParrainageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
