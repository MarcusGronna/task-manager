/**
 * Binder URL-vägar till komponenter
 *
 * https://angular.dev/guide/routing/common-router-tasks
 * https://angular.dev/reference/migrations/route-lazy-loading
 */

import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list.component'; // laddas lazy
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  // lazy-load
  { path: 'tasks/TaskListComponent', loadComponent: () => TaskListComponent },
  { path: '', redirectTo: 'tasks/TaskListComponent', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
