import { TestBed } from '@angular/core/testing';

import { MovieServces } from './movie-servces';

describe('MovieServces', () => {
  let service: MovieServces;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieServces);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
