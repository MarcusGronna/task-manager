/**
 * Binder URL-vägar till komponenter
 *
 * https://angular.dev/guide/routing/common-router-tasks
 * https://angular.dev/reference/migrations/route-lazy-loading
 */

import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component'; // laddas lazy
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectAddComponent } from './features/projects/project-add/project-add.component';
import { AddTaskComponent } from './features/tasks/add-task/add-task.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => DashboardComponent },
  { path: 'projects', loadComponent: () => ProjectListComponent },
  { path: 'projects/new', loadComponent: () => ProjectAddComponent },
  { path: 'tasks/:projectId/new', loadComponent: () => AddTaskComponent },
  {
    path: 'tasks/:projectId/edit/:taskId',
    loadComponent: () => AddTaskComponent,
  },
  { path: 'tasks/:projectId', loadComponent: () => TaskListComponent },
  { path: 'tasks', loadComponent: () => TaskListComponent },
  { path: '**', component: PageNotFoundComponent },
];
