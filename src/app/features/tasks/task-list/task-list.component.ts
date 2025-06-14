import { Component, inject, OnInit } from '@angular/core'; // komponent & DI-API
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list'; // Material-list
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material-checkbox
import { TaskService } from '../../../../services/task.service'; // datatjänst
import { Task } from '../../../models/task.model';
import { AddTaskComponent } from '../add-task/add-task.component'; // datatyp
import { Router, ActivatedRoute } from '@angular/router';
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
    NgFor,
    NgIf,
    AsyncPipe,
    MatListModule,
    MatCheckboxModule,
    AddTaskComponent,
    DragDropModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  private taskService = inject(TaskService); // DI: hämta servicen
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Ström: tasks för valt projekt
  // tasks$ = this.route.paramMap.pipe(
  //   switchMap((pm) => this.taskService.byProject(pm.get('projectId')!))
  // );

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

  /** kallad av (cdkDropListDropped) */
  sort(ev: CdkDragDrop<Task[]>, list: Task[]) {
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
    this.taskService.persistOrder(this.projectId, list); // ⇐ skriv LS (egen helper)
  }

  // Text för status
  statusLabel(t: Task) {
    return t.done ? '✔️ Klar' : '🕓 Pågår';
  }

  back() {
    this.router.navigate(['/projects']);
  }
  showCreated = this.router.getCurrentNavigation()?.extras?.state?.['created'];
}
