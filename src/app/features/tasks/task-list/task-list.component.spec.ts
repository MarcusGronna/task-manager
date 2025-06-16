import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { TaskService } from '../../../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';

const taskSvcStub = {
  byProject: () => of([]),
  toggle: () => of(void 0),
  persistOrder: () => {},
  remove: () => of(void 0),
};

const routeStub = { paramMap: of(new Map([['projectId', 'x']])) };

const routerStub = {
  navigate: () => {},
  getCurrentNavigation: () => ({ extras: { state: {} } }),
};

/* ---------- test­sviten --------------------------------------- */
describe('TaskListComponent – quick checks', () => {
  let comp: TaskListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent], // standalone-import
      providers: [
        { provide: TaskService, useValue: taskSvcStub },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ”Strunta i okända taggar”
    }).compileComponents();

    comp = TestBed.createComponent(TaskListComponent).componentInstance;
  });

  it('skapas utan fel', () => {
    expect(comp).toBeTruthy();
  });

  it('daysLeft() ger 1 för i morgon', () => {
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
    expect(comp.daysLeft(tomorrow)).toBe(1);
  });

  it('priorityLabel() översätter till svenska', () => {
    expect(comp.priorityLabel('high')).toBe('Hög');
    expect(comp.priorityLabel('medium')).toBe('Medel');
    expect(comp.priorityLabel('low')).toBe('Låg');
  });
});
