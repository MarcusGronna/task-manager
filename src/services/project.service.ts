import {
  inject,
  Injectable,
  signal,
  computed,
  effect,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../app/models/project.model';
import { environment } from '../environments/environment';
import { TaskService } from './task.service';

const LS_KEY = 'task-manager-db';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/projects`;
  private taskSvc = inject(TaskService);

  // -------------------------------------------------------------------------
  //  CACHE som signal
  // -------------------------------------------------------------------------
  private _projects: WritableSignal<Project[]> = signal([] as Project[]);
  readonly projects = this._projects.asReadonly();

  //  Stream-variant av signalen (kan pipe:as i komponenter)
  readonly projects$ = toObservable(this.projects);

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

  // -------------------------------------------------------------------------
  //  KONSTRUKTOR – ladda *en gång* och starta LS-synk
  // -------------------------------------------------------------------------
  constructor() {
    // läs från localStorage
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const { projects = [] } = JSON.parse(raw);
      this._projects.set(projects);
    }

    // hämta från back-end EN gång om interceptorn används
    this.http
      .get<Project[]>(this.base)
      .subscribe((list) => this._projects.set(list));

    // signal -> local-storage (autosave)
    effect(() => {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(LS_KEY) ?? '{}'),
          projects: this._projects(),
        })
      );
    });
  }

  // GET /projects
  getAll(): Observable<Project[]> {
    return this.projects$; // kopplat till signalen
  }

  getOne(id: string) {
    return this.projects$.pipe(
      map((list: Project[]) => list.find((p) => p.id === id)!)
    );
  }

  add(dto: Omit<Project, 'id' | 'createdAt'>) {
    const body = { ...dto, createdAt: new Date().toISOString() };

    return this.http
      .post<Project>(this.base, body)
      .pipe(tap((p) => this._projects.update((list) => [...list, p])));
  }

  update(patch: Project) {
    return this.http
      .put<Project>(`${this.base}/${patch.id}`, patch)
      .pipe(
        tap((changed) =>
          this._projects.update((list) =>
            list.map((p) => (p.id === changed.id ? changed : p))
          )
        )
      );
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => {
        // 1. Ta bort projektet ur cachen
        this._projects.update((list) => list.filter((p) => p.id !== id));

        // 2. Rensa bort alla tasks som hör till projektet
        this.taskSvc.clearByProject(id);
      })
    );
  }
}
