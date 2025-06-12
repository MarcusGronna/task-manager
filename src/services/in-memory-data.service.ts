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
// const LS_KEY = 'task-manager-db';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  // Grunddata
  createDb() {
    const projects: Project[] = [
      {
        _id: 'p1',
        name: 'Demo-projekt',
        description: 'Visar hur in-memory-db fungerar',
        deadline: '2025-06-15',
      },
    ];

    const tasks: Task[] = [
      {
        _id: 't1',
        projectId: 'p1',
        title: 'Första uppgiften',
        description: 'Projektets första uppgift',
        done: false,
        priority: 'medium',
        deadline: '2025-06-15',
        createdAt: new Date(),
      },
    ];

    return { projects, tasks };
  }

  // En enkel id-generator (om man POST:ar utan _id)
  genId<T extends { _id: string }>(collection: T[]): string {
    return String(
      collection.length > 0
        ? Math.max(...collection.map((c) => +c._id.replace(/\D/g, ''))) + 1
        : 1
    );
  }
}
