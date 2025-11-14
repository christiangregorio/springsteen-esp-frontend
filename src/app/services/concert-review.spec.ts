import { TestBed } from '@angular/core/testing';

import { ConcertReview } from './concert-review.service';

describe('ConcertReview', () => {
  let service: ConcertReview;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcertReview);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
