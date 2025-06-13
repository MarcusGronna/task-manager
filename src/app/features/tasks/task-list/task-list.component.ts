import { Component, inject, OnInit } from '@angular/core'; // komponent & DI-API
import { AsyncPipe, NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list'; // Material-list
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material-checkbox
import { TaskService } from '../../../../services/task.service'; // datatjänst
import { Task } from '../../../models/task.model';
import { AddTaskComponent } from '../add-task/add-task.component'; // datatyp
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    MatListModule,
    MatCheckboxModule,
    AddTaskComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private taskService = inject(TaskService); // DI: hämta servicen
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Ström: tasks för valt projekt
  tasks$ = this.route.paramMap.pipe(
    switchMap((pm) => this.taskService.byProject(pm.get('projectId')!))
  );

  // checkbox-klick
  toggle(task: Task) {
    this.taskService.toggle(task.id, !task.done).subscribe(); // PATCH till backend och trigga HTTP-anrop
  }

  // Text för status
  statusLabel(t: Task) {
    return t.done ? '✔️ Klar' : '🕓 Pågår';
  }

  showCreated = this.router.getCurrentNavigation()?.extras?.state?.['created'];
}
