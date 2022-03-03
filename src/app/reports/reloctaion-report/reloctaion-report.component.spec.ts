import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloctaionReportComponent } from './reloctaion-report.component';

describe('ReloctaionReportComponent', () => {
  let component: ReloctaionReportComponent;
  let fixture: ComponentFixture<ReloctaionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloctaionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloctaionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
