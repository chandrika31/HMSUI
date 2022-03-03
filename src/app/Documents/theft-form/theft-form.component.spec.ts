import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheftFormComponent } from './theft-form.component';

describe('TheftFormComponent', () => {
  let component: TheftFormComponent;
  let fixture: ComponentFixture<TheftFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheftFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
