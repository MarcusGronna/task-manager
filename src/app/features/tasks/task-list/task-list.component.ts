/**
 * Visar alla uppgifter i valt projekt.
 * UI-text på svenska, kod & filer på engelska.
 */

import { Component, inject } from '@angular/core'; // komponent & DI-API
import { AsyncPipe, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list'; // Material-list
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material-checkbox
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../../../services/task.service'; // datatjänst
import { Task } from '../../../models/task.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    DragDropModule,
    RouterLink,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private taskService = inject(TaskService); // DI: hämta servicen
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId!: string;

  tasks$ = this.route.paramMap.pipe(
    switchMap((pm) => {
      this.projectId = pm.get('projectId')!;
      return this.taskService.byProject(this.projectId);
    }),
    tap((list) => {
      if (list.length === 0) {
        // Tomt? – skicka direkt till add-form
        this.router.navigate(['new'], { relativeTo: this.route });
      }
    })
  );

  // checkbox-klick
  toggle(task: Task) {
    this.taskService.toggle(task.id, !task.done).subscribe(); // PATCH till backend och trigga HTTP-anrop
  }

  /** Drag-sortering */
  sort(ev: CdkDragDrop<Task[]>, list: Task[]) {
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
    this.taskService.persistOrder(this.projectId, list);
  }

  /** Label för dagar kvar */
  daysLeft = (iso: string) =>
    Math.max(0, Math.ceil((+new Date(iso) - Date.now()) / 86_400_000));

  // Text för status
  statusLabel(t: Task) {
    return t.done ? '✔️ Klar' : '🕓 Pågår';
  }

  back() {
    this.router.navigate(['/projects']);
  }
  showCreated = this.router.getCurrentNavigation()?.extras?.state?.['created'];
}
