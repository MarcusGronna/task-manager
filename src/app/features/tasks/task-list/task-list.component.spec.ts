import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';

import { TaskService } from '../../../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

/* ---------- minimal stubbar ----------------------------------- */
const tasks$ = new BehaviorSubject<any[]>([]);

const taskSvcStub = {
  byProject: () => tasks$, // streamen som komponenten lyssnar på
  toggle: () => of(void 0),
  persistOrder: () => {},
  remove: () => of(void 0),
};

const routerStub = {
  navigate: () => {},
  getCurrentNavigation: () => ({ extras: { state: {} } }),
};
/* --------------------------------------------------------------- */

describe('TaskListComponent (shallow)', () => {
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent], // standalone-import
      providers: [
        { provide: TaskService, useValue: taskSvcStub },
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRoute, // bara projekt-ID behövs
          useValue: {
            paramMap: of(new Map([['projectId', 'p1']])),
            snapshot: { paramMap: new Map([['projectId', 'p1']]) },
          },
        },
      ],
    })
      /* säkerställ att stubben ersätter root-providern */
      .overrideProvider(TaskService, { useValue: taskSvcStub })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges(); // ⬅️ första render
  });

  it('skapas utan fel', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
