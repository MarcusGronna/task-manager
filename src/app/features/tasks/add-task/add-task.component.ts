/**
 *
 * Docs:
 *
 * https://angular.dev/guide/forms
 * https://angular.dev/guide/forms/typed-forms
 */

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { TaskCreateDto } from '../../../models/task-create.dto';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  private fb = inject(FormBuilder); // bygger formuläret
  private taskService = inject(TaskService); // anropar API
  private router = inject(Router); // navigation

  // Reactive Form-grupp
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
  });

  // submit-funktion
  // save() {
  //   if (this.form.valid) {
  //     this.taskService.add(
  //       this.form.getRawValue() as { title: string; description?: string } // POST till backend
  //     );
  //     this.router.navigate(['/task']); // tillbaka till listan
  //   }
  // }

  save() {
    if (this.form.invalid) return;

    const dto: TaskCreateDto = {
      ...this.form.getRawValue(),
      projectId: 'p1',
      priority: 'medium',
      deadline: new Date().toISOString(),
    };

    this.taskService.add(dto);
    this.router.navigate(['/task']);
  }
}
