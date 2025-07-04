/**
 * Visar alla uppgifter i valt projekt.
 * UI-text på svenska,
 *
 */

import { Component, inject } from '@angular/core'; // komponent & DI-API
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list'; // Material-list
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material-checkbox
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TaskService } from '../../../../services/task.service'; // datatjänst
import { Task, TaskPriority } from '../../../models/task.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { switchMap, tap } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFilterPipe } from '../../../shared/pipes/task-filter.pipe';
import { OverdueDirective } from '../../../shared/directives/overdue.directive';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatIconButton,
    MatFormField,
    MatButtonToggleModule,
    MatLabel,
    MatInputModule,
    DragDropModule,
    RouterLink,
    NgClass,
    TaskFilterPipe,
    OverdueDirective,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private taskService = inject(TaskService); // DI: hämta servicen
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Search
  searchCtrl = new FormControl('', { nonNullable: true });
  selectedStatus: 'all' | 'active' | 'done' = 'all';

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
  toggle(id: string, checked: boolean) {
    this.taskService.toggle(id, checked).subscribe(); // PATCH till backend och trigga HTTP-anrop
  }

  // Drag-sortering
  sort(ev: CdkDragDrop<Task[]>, list: Task[]) {
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
    this.taskService.persistOrder(this.projectId, list);
  }

  // Label för dagar kvar
  daysLeft = (iso: string) =>
    Math.max(0, Math.ceil((+new Date(iso) - Date.now()) / 86_400_000));

  // Text för status
  statusLabel(t: Task) {
    return t.done ? '✔️ Klar' : '🕓 Pågår';
  }

  // Radera uppgift
  remove(id: string) {
    this.taskService.remove(id).subscribe();
  }

  back() {
    this.router.navigate(['/projects']);
  }
  showCreated = this.router.getCurrentNavigation()?.extras?.state?.['created'];

  //  Svensk label för prioritet
  priorityLabel(p: TaskPriority): string {
    switch (p) {
      case 'high':
        return 'Hög';
      case 'medium':
        return 'Medel';
      default:
        return 'Låg';
    }
  }
}
