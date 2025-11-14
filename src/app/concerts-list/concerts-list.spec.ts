import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertsList } from './concerts-list';

describe('ConcertsList', () => {
  let component: ConcertsList;
  let fixture: ComponentFixture<ConcertsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
