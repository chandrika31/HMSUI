import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReportBydateComponent } from './ticket-report-bydate.component';

describe('TicketReportBydateComponent', () => {
  let component: TicketReportBydateComponent;
  let fixture: ComponentFixture<TicketReportBydateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketReportBydateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketReportBydateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
