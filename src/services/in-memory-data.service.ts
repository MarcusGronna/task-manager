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

    // Default-data första gången
    const projects: Project[] = [
      // {
      //   id: 'p1',
      //   name: 'Demo-projekt',
      //   description: 'Visar hur in-memory-db fungerar',
      //   deadline: '2025-06-15',
      //   createdAt: new Date().toISOString(),
      // },
    ];

    const tasks: Task[] = [
      // {
      //   id: 't1',
      //   projectId: 'p1',
      //   title: 'Första uppgiften',
      //   description: 'Projektets första uppgift',
      //   done: false,
      //   priority: 'medium',
      //   deadline: '2025-06-15',
      //   createdAt: new Date(),
      // },
    ];

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
    // Endast om  det inte var en GET
    if (ri.method !== 'GET') {
      // Läs in äldre data om den finns
      const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
      const db = ri.utils.getDb(); // uppdaterad collection

      // Hämta den uppdaterade samlingen från interceptorn
      const newDbState = ri.utils.getDb();

      // Slå ihop samlingarna, skriv över enskilda collections, men behåll de som inte förändrats
      const merged = { ...stored, ...db }; // behåll övriga

      localStorage.setItem(LS_KEY, JSON.stringify(merged));
    }
    return res;
  }
}
