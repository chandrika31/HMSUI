import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheftReportComponent } from './theft-report.component';

describe('TheftReportComponent', () => {
  let component: TheftReportComponent;
  let fixture: ComponentFixture<TheftReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheftReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
