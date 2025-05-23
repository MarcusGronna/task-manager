import { Component, inject } from '@angular/core'; // komponent & DI-API
import { AsyncPipe, NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list'; // Material-list
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material-checkbox
import { TaskService } from './task.service'; // datatjänst
import { Task } from '../../models/task.model'; // datatyp

@Component({
  selector: 'app-task-list',
  imports: [NgFor, AsyncPipe, MatListModule, MatCheckboxModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private taskService = inject(TaskService); // DI: hämta servicen

  tasks$ = this.taskService.getAll(); // Observable med data

  // checkbox-klick
  toggle(task: Task) {
    this.taskService.toggle(task._id, !task.done).subscribe(); // PATCH till backend och trigga HTTP-anrop
  }

  // Text för status
  status(t: Task) {
    return t.done ? '✔️ Klar' : '🕓 Pågår';
  }
}
