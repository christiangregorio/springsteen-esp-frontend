import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertReview } from './concert-review';

describe('ConcertReview', () => {
  let component: ConcertReview;
  let fixture: ComponentFixture<ConcertReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
