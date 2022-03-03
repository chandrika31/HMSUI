import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalamityReportComponent } from './calamity-report.component';

describe('CalamityReportComponent', () => {
  let component: CalamityReportComponent;
  let fixture: ComponentFixture<CalamityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalamityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalamityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
