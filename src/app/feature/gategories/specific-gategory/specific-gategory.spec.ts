import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGategory } from './specific-gategory';

describe('SpecificGategory', () => {
  let component: SpecificGategory;
  let fixture: ComponentFixture<SpecificGategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificGategory],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecificGategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
