import {
  inject,
  Injectable,
  signal,
  computed,
  effect,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../app/models/project.model';
import { environment } from '../environments/environment';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/projects`;
  private taskSvc = inject(TaskService);

  // private _projects$ = new BehaviorSubject<Project[]>([]);
  // projects$ = this._projects$.asObservable();
  private _projects: WritableSignal<Project[]> = signal([] as Project[]);
  readonly projects = this._projects.asReadonly(); // getter i komponenter

  search = signal('');
  statusFilter = signal<'all' | 'active' | 'done'>('all');

  readonly filteredProjects = computed(() => {
    const term = this.search().toLowerCase();
    const status = this.statusFilter();
    return this.projects() // <-- getter
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) &&
          (status === 'all' ? true : p.completed === (status === 'done'))
      )
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
  });

  constructor() {
    // läs från localStorage
    const raw = localStorage.getItem('tm-db');
    if (raw) {
      const { projects = [] } = JSON.parse(raw);
      this._projects.set(projects);
    }
    // automatiskt  → localStorage
    effect(() => {
      localStorage.setItem(
        'tm-db',
        JSON.stringify({ projects: this._projects() })
      );
    });
  }

  // GET /projects
  getAll(): Observable<Project[]> {
    this.http
      .get<Project[]>(this.base) // hämta en gång
      .subscribe((list) => this._projects.set(list)); // signal-setter
    return this.projects$; // levande ström
  }

  getOne(id: string) {
    return this.projects$.pipe(
      map((list: Project[]) => list.find((p) => p.id === id)!)
    );
  }

  add(dto: Omit<Project, 'id' | 'createdAt'>) {
    const p: Project = {
      ...dto,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    // SIG-START: uppdatera via Signal
    this._projects.update((list) => [...list, p]);
    // SIG-END
    return of(p); // dummy-observable så API:et ser likadant ut
  }

  // add(dto: Omit<Project, 'id' | 'createdAt'>) {
  //   return this.http
  //     .post<Project>(this.base, dto)
  //     .pipe(tap((p) => this._projects$.next([...this._projects$.value, p])));
  // }

  // PUT /projects/:id
  // update(p: Project) {
  //   return this.http
  //     .put<Project>(`${this.base}/${p.id}`, p)
  //     .pipe(
  //       tap(() =>
  //         this._projects$.next(
  //           this._projects$.value.map((x) =>
  //             x.id === p.id ? { ...x, ...p } : x
  //           )
  //         )
  //       )
  //     );
  // }
  update(patch: Project) {
    this._projects.update((list) =>
      list.map((p) => (p.id === patch.id ? { ...p, ...patch } : p))
    );
    return of(patch);
  }

  // DELETE /projects/:id
  // remove(id: string) {
  //   return this.http.delete<void>(`${this.base}/${id}`).pipe(
  //     tap(() => {
  //       // 1. uppdatera project-listan i minnescachen (fanns redan)
  //       this._projects$.next(this._projects$.value.filter((p) => p.id !== id));

  //       // 2. röj tasks ur TaskService-cachen
  //       this.taskSvc.clearByProject(id);
  //     })
  //   );
  // }

  remove(id: string) {
    this._projects.update((list) => list.filter((p) => p.id !== id));
    return of(void 0);
  }

  projects$ = toObservable(this.projects);
}
