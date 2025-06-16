/**
 *
 * Docs:
 *
 * https://angular.dev/guide/forms
 * https://angular.dev/guide/forms/typed-forms
 */

import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../../../services/task.service';
import { TaskCreateDto } from '../../../models/task-create.dto';
import { TaskPriority, Task } from '../../../models/task.model';

// ------------------------------------------------------------
//  Typed Form interface – alla kontroller får rätt typ
// ------------------------------------------------------------
interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<TaskPriority>;
  deadline: FormControl<Date>;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  //---------------------------------------------------------------------------
  // DI – hämtar verktyg och tjänster
  //---------------------------------------------------------------------------
  private fb = inject(FormBuilder); // bygger formuläret
  private taskService = inject(TaskService); // anropar "API"
  private route = inject(ActivatedRoute); // läser route-parametrar
  private router = inject(Router); // navigation

  //---------------------------------------------------------------------------
  //  Komponent-state
  //---------------------------------------------------------------------------
  isEdit = false; // växlar mellan create / edit
  taskId!: string; // sätts i ngOnInit vid edit
  projectId = this.route.snapshot.paramMap.get('projectId')!;

  // ------------------------------------------------------------
  //  Reactive Form – strikt typad
  // ------------------------------------------------------------
  form = this.fb.nonNullable.group<TaskForm>({
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
    priority: this.fb.nonNullable.control<TaskPriority>(
      'medium',
      Validators.required
    ),
    deadline: this.fb.nonNullable.control(new Date(), Validators.required),
  });

  //---------------------------------------------------------------------------
  //  Lifecycle
  //---------------------------------------------------------------------------
  ngOnInit(): void {
    // Läs ev. taskId (null vid create)
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';

    // EDIT-läge? → hämta uppgiften och fyll formuläret
    if (this.taskId) {
      this.isEdit = true;

      this.taskService.getOne(this.taskId).subscribe((task) => {
        if (!task) {
          console.error('Uppgiften hittades inte');
          this.router.navigate(['/projects', this.projectId, 'tasks']);
          return;
        }

        // Patcha formuläret – datepicker kräver Date-objekt
        this.form.patchValue({
          ...task,
          deadline: new Date(task.deadline),
        });
      });
    }
  }

  //---------------------------------------------------------------------------
  //  UX-hjälp: lägg till x dagar på deadline
  //---------------------------------------------------------------------------
  // Hjälpknapp ± x dagar
  shiftDeadline(days: number) {
    const d = new Date(this.form.controls.deadline.value);
    d.setDate(d.getDate() + days);
    this.form.controls.deadline.setValue(d);
  }

  // plusDays -> anropa shiftDeadline så ingen annan kod bryts
  plusDays(days: number) {
    this.shiftDeadline(days);
  }

  //---------------------------------------------------------------------------
  //  Spara – avgör create vs edit, anropar service och navigerar tillbaka
  //---------------------------------------------------------------------------
  save() {
    if (this.form.invalid) return;

    // Gemensamt DTO för både add & edit
    const dto: TaskCreateDto = {
      ...this.form.getRawValue(), // title, description, priority
      deadline: this.form.controls.deadline.value.toISOString(),
      projectId: this.projectId,
    };

    // Välj rätt anrop beroende på läge
    const req$ = this.isEdit
      ? this.taskService.update({ id: this.taskId, ...dto } as Task)
      : this.taskService.add(dto);

    req$.subscribe(() => {
      this.router.navigate(
        ['/projects', this.projectId, 'tasks'],
        { state: { created: !this.isEdit } } // feedback till listan
      );
    });
  }
}
