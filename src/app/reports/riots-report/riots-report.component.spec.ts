import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotsReportComponent } from './riots-report.component';

describe('RiotsReportComponent', () => {
  let component: RiotsReportComponent;
  let fixture: ComponentFixture<RiotsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiotsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiotsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
