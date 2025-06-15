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

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  // Grunddata
  createDb() {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    const projects: Project[] = [];

    const tasks: Task[] = [];

    localStorage.setItem(LS_KEY, JSON.stringify({ projects, tasks }));
    return { projects, tasks };
  }

  // En enkel id-generator (om man POST:ar utan _id)
  genId<T extends { id?: string }>(collection: T[]): string {
    const nums = collection
      .map((c) => c.id as string | undefined)
      .filter(Boolean)
      .map((s) => +s!.toString().replace(/\D/g, ''));

    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return 'p' + next;
  }

  // Skriv tillbaka till databasen efter POST/PUT/DELETE
  responseInterceptor(res: ResponseOptions, ri: RequestInfo) {
    // 1. Om det var en DELETE på /projects/:id
    if (ri.method === 'DELETE' && ri.collectionName === 'projects') {
      const deletedId = ri.id as string;

      // 1a) Plocka fram aktuellt DB-objekt
      const db = ri.utils.getDb() as any; // { projects:[], tasks:[] }

      // 1b) Filtrera bort alla tasks som hör till projektet
      db.tasks = db.tasks.filter((t: any) => t.projectId !== deletedId);

      // 1c) Skriv tillbaka till localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(db));
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
