/** Samlar alla CRUD-anrop mot /tasks
 * Komponenter pratar endast med denna service
 * HttpClient aktiveras globalt via providHttpClient
 *
 * https://angular.dev/guide/http
 * https://angular.dev/api/common/http/provideHttpClient
 */

import { inject, Injectable } from '@angular/core'; // DI-verktyg
import { HttpClient } from '@angular/common/http'; // HTTP-klient :
import { Observable } from 'rxjs'; // RxJS strömtyp
import { Task } from '../../models/task.model'; // mitt interface
import { environment } from '../../../environments/environment.development'; // miljö-konstant

@Injectable({ providedIn: 'root' }) // registrerar som global singleton
export class TaskService {
  private http = inject(HttpClient); // hämtar HttpClient-instans
  private base = `${environment.apiUrl}/tasks`; // bygger bas-UTL

  // GET /tasks -> Task-lista
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base);
  }

  // POST /tasks
  add(task: Omit<Task, '_id' | 'createdAt'>): Observable<Task> {
    return this.http.post<Task>(this.base, task);
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
