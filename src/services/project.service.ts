import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, tap, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../app/models/project.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/projects`;

  private _projects$ = new BehaviorSubject<Project[]>([]);
  projects$ = this._projects$.asObservable();

  // GET /projects
  getAll(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.base)
      .pipe(tap((data) => this._projects$.next(data)));
  }

  // POST /projects
  // add(data: Omit<Project, 'id' | 'createdAt'>) {
  //   return this.http
  //     .post<Project>(this.base, data)
  //     .pipe(
  //       tap((p) => this._projects$.next([...this._projects$.value, p])),
  //       catchError((err) => {
  //         console.error(err);
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe();
  // }
  add(dto: Omit<Project, 'id' | 'createdAt'>) {
    return this.http
      .post<Project>(this.base, dto)
      .pipe(tap((p) => this._projects$.next([...this._projects$.value, p])));
  }

  // PUT /projects/:id
  update(p: Project) {
    return this.http.put<Project>(`${this.base}/${p.id}`, p);
  }

  // DELETE /projects/:id
  remove(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
