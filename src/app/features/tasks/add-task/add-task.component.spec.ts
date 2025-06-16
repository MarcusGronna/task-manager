import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AddTaskComponent } from './add-task.component';
import { TaskService } from '../../../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';

const taskSvcStub = {
  add: () => of(void 0),
  update: () => of(void 0),
  getOne: () => of(void 0),
};

const routeStub = {
  snapshot: {
    paramMap: {
      get: (k: string) => {
        // projectId behövs vid konstruktionen, taskId returneras som null
        if (k === 'projectId') {
          return 'p1';
        }
        return null;
      },
    },
  },
};

const routerStub = {
  navigate: () => {},
  getCurrentNavigation: () => ({ extras: { state: {} } }),
};

// ----- test­sviten ------------------------------------------
describe('AddTaskComponent – quick checks', () => {
  let comp: AddTaskComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskComponent], // standalone
      providers: [
        { provide: TaskService, useValue: taskSvcStub },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignorera okända taggar
    }).compileComponents();

    comp = TestBed.createComponent(AddTaskComponent).componentInstance;
  });

  it('skapas utan fel', () => {
    expect(comp).toBeTruthy();
  });

  it('har "medium" som default-prioritet', () => {
    expect(comp.form.controls.priority.value).toBe('medium');
  });

  it('plusDays(3) flyttar deadline tre dagar framåt', () => {
    const start = new Date(comp.form.controls.deadline.value);
    comp.plusDays(3);
    const after = new Date(comp.form.controls.deadline.value);
    // skillnaden ska vara 3 dygn (86 400 000 ms per dag)
    expect(+after - +start).toBe(3 * 86_400_000);
  });
});
