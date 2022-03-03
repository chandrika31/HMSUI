import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotFormComponent } from './riot-form.component';

describe('RiotFormComponent', () => {
  let component: RiotFormComponent;
  let fixture: ComponentFixture<RiotFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiotFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
