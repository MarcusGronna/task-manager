/** Samlar alla CRUD-anrop mot /todo
 * Komponenter pratar endast med denna service
 * HttpClient aktiveras globalt via providHttpClient
 *
 *
 * Docs:
 * https://angular.dev/guide/http
 * https://angular.dev/api/common/http/provideHttpClient
 * https://angular.dev/guide/http#making-a-post-request
 *
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
 *
 * https://mongoosejs.com/docs/api/model.html
 * https://expressjs.com/en/4x/api.html#router
 * https://expressjs.com/en/4x/api.html#app.use
 */

import { inject, Injectable } from '@angular/core'; // DI-verktyg
import { HttpClient } from '@angular/common/http'; // HTTP-klient :
import { Observable, tap, EMPTY, catchError, BehaviorSubject, map } from 'rxjs'; // RxJS strömtyp
import { Task } from '../app/models/task.model'; // mitt interface
import { TaskCreateDto } from '../app/models/task-create.dto';
import { environment } from '../environments/environment'; // miljö-konstant

@Injectable({ providedIn: 'root' }) // registrerar som global singleton
export class TaskService {
  // -------------------------------------------------------------------------
  //  DI + konstanter
  // -------------------------------------------------------------------------
  private http = inject(HttpClient); // hämtar HttpClient-instans
  private base = `${environment.apiUrl}/tasks`; // bygger bas-UTL

  // -------------------------------------------------------------------------
  //  Lokal cache – gör att UI uppdateras direkt utan extra GET
  // -------------------------------------------------------------------------
  private _tasks$ = new BehaviorSubject<Task[]>([]); // init tom lista
  tasks$ = this._tasks$.asObservable(); // readonly-ström till komponenter

  constructor() {
    // Hämta initial data en gång
    this.refresh();
  }

  // Get /tasks - laddar allt och puttar in i cache
  private refresh() {
    this.http
      .get<Task[]>(this.base)
      .subscribe((list) => this._tasks$.next(list));
  }

  // -------------------------------------------------------------------------
  //  READ – enskild post
  // -------------------------------------------------------------------------
  getOne(id: string): Observable<Task> {
    return this.tasks$.pipe(map((list) => list.find((t) => t.id === id)!));
  }

  // GET /tasks -> Task-lista
  // getAll(): Observable<Task[]> {
  //   return this.http.get<Task[]>(this.base);
  // }
  // --- READ : tasks för ett projekt ----------------------------------------
  byProject(projectId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((list) => list.filter((t) => t.projectId === projectId))
    );
  }

  // --- READ : alla poster (ingen filtrering) -------------------------------
  all(): Observable<Task[]> {
    return this.tasks$; // redan cachat
  }

  // POST /todo -> skickar JSON-body -> lägger till ny todo
  // add(dto: Omit<Task, 'id' | 'createdAt' | 'done'>): void {
  //   this.http
  //     .post<Task>(this.base, dto) // HTTP POST med body = dto
  //     .pipe(
  //       tap((newTask) => this._tasks$.next([...this._tasks$.value, newTask])), // pusha in i listan
  //       catchError((err) => {
  //         console.error(err);
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe();
  // }

  // -------------------------------------------------------------------------
  //  CREATE
  // -------------------------------------------------------------------------
  add(dto: TaskCreateDto): Observable<Task> {
    return this.http.post<Task>(this.base, dto).pipe(
      tap((newTask) => this._tasks$.next([...this._tasks$.value, newTask])),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }
  // PATCH /task/:id
  // toggle(id: string, done: boolean): Observable<Task> {
  //   return this.http.patch<Task>(`${this.base}/${id}`, { done });
  // }

  // -------------------------------------------------------------------------
  //  UPDATE (PUT /tasks/:id)
  // -------------------------------------------------------------------------
  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.base}/${task.id}`, task).pipe(
      tap((changed) =>
        this._tasks$.next(
          this._tasks$.value.map((t) => (t.id === changed.id ? changed : t))
        )
      ),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }

  // -------------------------------------------------------------------------
  //  TOGGLE done (PATCH)
  // -------------------------------------------------------------------------
  toggle(id: string, done: boolean): Observable<Task> {
    return this.http
      .patch<Task>(`${this.base}/${id}`, { done })
      .pipe(
        tap((changed) =>
          this._tasks$.next(
            this._tasks$.value.map((t) => (t.id === changed.id ? changed : t))
          )
        )
      );
  }

  // DELETE /tasks/:id
  // remove(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.base}/${id}`);
  // }

  // -------------------------------------------------------------------------
  //  DELETE
  // -------------------------------------------------------------------------
  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${id}`)
      .pipe(
        tap(() =>
          this._tasks$.next(this._tasks$.value.filter((t) => t.id !== id))
        )
      );
  }
}
