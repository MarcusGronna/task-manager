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
import { Observable, tap, EMPTY, catchError, BehaviorSubject } from 'rxjs'; // RxJS strömtyp
import { Task } from '../app/models/task.model'; // mitt interface
import { environment } from '../environments/environment'; // miljö-konstant

@Injectable({ providedIn: 'root' }) // registrerar som global singleton
export class TaskService {
  private http = inject(HttpClient); // hämtar HttpClient-instans
  private base = `${environment.apiUrl}/todos`; // bygger bas-UTL

  // Lokal state-hållare så UI uppdateras direkt
  private _tasks$ = new BehaviorSubject<Task[]>([]); // init tom lista
  tasks$ = this._tasks$.asObservable(); // readonly-ström till komponenter

  // GET /tasks -> Task-lista
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base);
  }

  // POST /todo -> skickar JSON-body -> lägger till ny todo
  add(dto: Omit<Task, '_id' | 'createdAt' | 'done'>): void {
    this.http
      .post<Task>(this.base, dto) // HTTP POST med body = dto
      .pipe(
        tap((newTask) => this._tasks$.next([...this._tasks$.value, newTask])), // pusha in i listan
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  // PATCH /task/:id
  toggle(id: string, done: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.base}/${id}`, { done });
  }

  // DELETE /tasks/:id
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
