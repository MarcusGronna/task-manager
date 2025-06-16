import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { commonTestProviders } from '../testing/test-utensils';

describe('ProjectService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: commonTestProviders })
  );

  it('skapas', () => expect(TestBed.inject(ProjectService)).toBeTruthy());
});
