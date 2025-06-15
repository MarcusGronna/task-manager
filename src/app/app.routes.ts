/**
 * Binder URL-vägar till komponenter
 *
 * https://angular.dev/guide/routing/common-router-tasks
 * https://angular.dev/reference/migrations/route-lazy-loading
 */

import { Routes } from '@angular/router';

import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectAddComponent } from './features/projects/project-add/project-add.component';

import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { AddTaskComponent } from './features/tasks/add-task/add-task.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  // default → dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard
  { path: 'dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Projekt
  {
    path: 'projects',
    children: [
      { path: '', component: ProjectListComponent }, // lista
      { path: 'new', component: ProjectAddComponent }, // nytt projekt
      { path: ':id/edit', component: ProjectAddComponent }, //  EDIT

      // --- Uppgifter i valt projekt ------------------------------
      {
        path: ':projectId/tasks',
        children: [
          { path: '', component: TaskListComponent }, // lista
          { path: 'new', component: AddTaskComponent }, // ny uppgift
          { path: ':taskId/edit', component: AddTaskComponent }, //  EDIT
        ],
      },
    ],
  },

  // catch-all (404)
  { path: '**', component: PageNotFoundComponent },
];
