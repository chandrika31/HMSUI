import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelocationFormComponent } from './relocation-form.component';

describe('RelocationFormComponent', () => {
  let component: RelocationFormComponent;
  let fixture: ComponentFixture<RelocationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelocationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
