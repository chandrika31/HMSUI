import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalCalamitiesComponent } from './natural-calamities.component';

describe('NaturalCalamitiesComponent', () => {
  let component: NaturalCalamitiesComponent;
  let fixture: ComponentFixture<NaturalCalamitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaturalCalamitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaturalCalamitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
