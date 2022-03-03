import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTicketsReportComponent } from './all-tickets-report.component';

describe('AllTicketsReportComponent', () => {
  let component: AllTicketsReportComponent;
  let fixture: ComponentFixture<AllTicketsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTicketsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTicketsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
