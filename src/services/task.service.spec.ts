import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { TaskCreateDto } from '../app/models/task-create.dto';

describe('TaskService (småtest)', () => {
  let svc: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      //  ger HttpClient + test-backend innan tjänster skapas
      imports: [HttpClientTestingModule],
    });

    svc = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  it('skapas utan fel', () => {
    expect(svc).toBeTruthy();
  });

  it('add() POST:ar och uppdaterar in-memory-listan', () => {
    const dto: TaskCreateDto = {
      title: 'Demo',
      description: '',
      priority: 'medium',
      deadline: new Date().toISOString(),
      projectId: 'p1',
    };

    /* 1. Kalla metoden */
    svc.add(dto).subscribe((created) => {
      expect(created.title).toBe('Demo');
    });

    /* 2. Fånga HTTP-anropet och svara */
    const req = http.expectOne(`${svc['base']}`); // '/api/tasks' osv.
    expect(req.request.method).toBe('POST');
    req.flush({ ...dto, id: 't1', done: false });

    /* 3. Cachen (signalen) ska nu innehålla 1 element */
    svc.all().subscribe((list) => expect(list.length).toBe(1));

    http.verify();
  });
});
