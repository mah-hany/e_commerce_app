import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fotgotpassword } from './fotgotpassword';

describe('Fotgotpassword', () => {
  let component: Fotgotpassword;
  let fixture: ComponentFixture<Fotgotpassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fotgotpassword],
    }).compileComponents();

    fixture = TestBed.createComponent(Fotgotpassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
