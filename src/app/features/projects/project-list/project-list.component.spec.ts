// project-list.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';

import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../models/project.model';
import { Router } from '@angular/router';

import {
  commonTestImports,
  commonTestProviders,
} from '../../../../testing/test-utensils';

/* --- mock-data & stub --- */
const demo: Project[] = [
  /* … */
];
const stream = new BehaviorSubject<Project[]>(demo);

const projStub = {
  projects$: stream,
  search: { set: () => {} },
  statusFilter: { set: () => {} },
  remove: jasmine.createSpy('remove').and.returnValue(of(void 0)),
  getAll: () => of(demo),
};

describe('ProjectListComponent', () => {
  let fixture: ComponentFixture<ProjectListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent, ...commonTestImports],
      providers: [
        ...commonTestProviders,
        { provide: ProjectService, useValue: projStub },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // spionera efter att router finns

    fixture = TestBed.createComponent(ProjectListComponent);
    fixture.detectChanges();
  });

  it('renderar två rader', () => {
    expect(fixture.debugElement.queryAll(By.css('mat-list-item')).length).toBe(
      2
    );
  });
});
