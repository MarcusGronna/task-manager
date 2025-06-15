/**
 * Deklarerar en fake-"databas" som Angular kan anropa via HttpClient.
 * Jag använder paketet "angular-in-memory-web-api" för att få ett REST-liknande
 * API - utan att starta en riktig server.
 */

import { Injectable } from '@angular/core';
import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
} from 'angular-in-memory-web-api'; // Interface + hjälpklass för mock-servern

import { Project } from '../app/models/project.model'; // egen typescript-model
import { Task } from '../app/models/task.model';

// Konstant nyckel för att spara/läsa 'databasen' i localStorage
const LS_KEY = 'task-manager-db';

let taskCounter = 1;
let projectCounter = 1;

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  // Grunddata
  createDb() {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      const db = JSON.parse(stored) as { projects: Project[]; tasks: Task[] };

      // --- Sätt räknarna till max + 1 ------------------------------------
      const maxProject = db.projects
        .map((p) => Number((p.id ?? '').replace(/^p/, '')))
        .reduce((a, b) => Math.max(a, b), 0);

      const maxTask = db.tasks
        .map((t) => Number((t.id ?? '').replace(/^t/, '')))
        .reduce((a, b) => Math.max(a, b), 0);

      projectCounter = maxProject + 1;
      taskCounter = maxTask + 1;

      return db;
    }

    // Första gången – starta tom databas
    const projects: Project[] = [];
    const tasks: Task[] = [];
    localStorage.setItem(LS_KEY, JSON.stringify({ projects, tasks }));
    return { projects, tasks };
  }

  // En enkel id-generator (om man POST:ar utan _id)
  genId<T>(collection: string, _collectionName: string): string {
    if (_collectionName === 'projects') return `p${projectCounter++}`;
    if (_collectionName === 'tasks') return `t${taskCounter++}`;
    return crypto.randomUUID(); // fallback
  }

  /* ===================================================================
       Interceptor: körs efter varje request innan svaret skickas ut
     ================================================================= */
  // Skriv tillbaka till databasen efter POST/PUT/DELETE
  responseInterceptor(res: ResponseOptions, ri: RequestInfo) {
    // 1. Om det var en DELETE på /projects/:id
    if (ri.method === 'DELETE' && ri.collectionName === 'projects') {
      const deletedId = ri.id as string;

      // 1a) Plocka fram aktuellt DB-objekt
      const db = ri.utils.getDb() as any;

      // 1b) Filtrera bort alla tasks som hör till projektet
      if (Array.isArray(db.tasks)) {
        db.tasks = db.tasks.filter((t: any) => t.projectId !== deletedId);
      }

      // 1c) Skriv tillbaka till localStorage
      localStorage.setItem('task-manager-db', JSON.stringify(db));
    }
    // 2. Standard-sparning för POST, PUT, PATCH, DELETE
    if (ri.method !== 'GET') {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
      const merged = { ...stored, ...ri.utils.getDb() };
      localStorage.setItem(LS_KEY, JSON.stringify(merged));
    }

    return res;
  }
}
