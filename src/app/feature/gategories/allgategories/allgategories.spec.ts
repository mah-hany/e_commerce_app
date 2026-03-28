import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allgategories } from './allgategories';

describe('Allgategories', () => {
  let component: Allgategories;
  let fixture: ComponentFixture<Allgategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allgategories],
    }).compileComponents();

    fixture = TestBed.createComponent(Allgategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
