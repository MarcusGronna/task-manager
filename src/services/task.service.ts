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
import { Task } from '../app/models/task.model'; // mitt interface/datamodell
import { TaskCreateDto } from '../app/models/task-create.dto'; // CREATE-DTO
import { environment } from '../environments/environment'; // miljö-konstant

// localStorage-nyckel (samma som InMemoryDataService)
const LS_KEY = 'task-manager-db';

@Injectable({ providedIn: 'root' }) // registrerar som global singleton
export class TaskService {
  // persistOrder(projectId: string, list: Task[]) {
  //   throw new Error('Method not implemented.');
  // }

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

  // Hämta initial data en gång
  constructor() {
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

  /** Enskild uppgift utifrån id */
  getOne(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(map((list) => list.find((t) => t.id === id)!));
  }

  /** Alla uppgifter för valt projekt */
  byProject(projectId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((list) => list.filter((t) => t.projectId === projectId))
    );
  }

  /** Alla uppgifter (ingen filtrering) */
  all(): Observable<Task[]> {
    return this.tasks$; // redan cacheat
  }

  // -------------------------------------------------------------------------
  //  CREATE (POST /tasks)
  // -------------------------------------------------------------------------
  add(dto: TaskCreateDto): Observable<Task> {
    return this.http.post<Task>(this.base, dto).pipe(
      tap((newTask) => {
        this._tasks$.next([...this._tasks$.value, newTask]);
        this.saveToLocalStorage();
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }

  // -------------------------------------------------------------------------
  //  UPDATE (PUT /tasks/:id)
  // -------------------------------------------------------------------------
  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.base}/${task.id}`, task).pipe(
      map((res) => res ?? task),
      tap((changed) =>
        this._tasks$.next(
          this._tasks$.value.map((t) => (t.id === changed.id ? changed : t))
        )
      )
    );
  }

  // -------------------------------------------------------------------------
  //  TOGGLE done (PATCH /tasks/:id)
  // -------------------------------------------------------------------------
  toggle(id: string, done: boolean): Observable<Task> {
    /* 1. Hämta originalet ur cachen */
    const original = this._tasks$.value.find((t) => t.id === id);
    if (!original) return EMPTY; // nothing to update → avsluta tyst

    /* 2. Skapa en uppdaterad kopia */
    const updated: Task = { ...original, done };

    /* 3. PUT – vissa back-end (in-memory) svarar med null ⇒ fall-back till vår kopia */
    return this.http.patch<Task>(`${this.base}/${id}`, { done }).pipe(
      map(
        (res) =>
          res ?? { ...this._tasks$.value.find((t) => t.id === id)!, done }
      ),
      tap((changed) =>
        this._tasks$.next(
          this._tasks$.value.map((t) => (t.id === changed.id ? changed : t))
        )
      )
    );
  }
  // -------------------------------------------------------------------------
  //  DELETE (DELETE /tasks/:id)
  // -------------------------------------------------------------------------
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => {
        this._tasks$.next(this._tasks$.value.filter((t) => t.id !== id));
        this.saveToLocalStorage();
      })
    );
  }

  // Röj alla tasks som hör till ett projekt (anropas av ProjectService)
  clearByProject(projectId: string) {
    const remaining = this._tasks$.value.filter(
      (t) => t.projectId !== projectId
    );
    this._tasks$.next(remaining);
  }

  // -------------------------------------------------------------------------
  //  PERSIST ORDER – skriv ny sortering efter drag-and-drop
  // -------------------------------------------------------------------------
  persistOrder(projectId: string, list: Task[]): void {
    // 1. uppdatera cache direkt
    this._tasks$.next([
      ...this._tasks$.value.filter((t) => t.projectId !== projectId),
      ...list, // redan sorterad lista
    ]);

    // 2. skriv tillbaka till localStorage
    this.saveToLocalStorage();
  }

  // -------------------------------------------------------------------------
  //  Helper: skriv hela task-arrayen till LS (behåller projects-delen)
  // -------------------------------------------------------------------------
  private saveToLocalStorage() {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    const merged = { ...stored, tasks: this._tasks$.value };
    localStorage.setItem(LS_KEY, JSON.stringify(merged));
  }
}
