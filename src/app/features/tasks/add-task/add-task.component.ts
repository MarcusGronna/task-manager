/**
 *
 * Docs:
 *
 * https://angular.dev/guide/forms
 * https://angular.dev/guide/forms/typed-forms
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskService } from '../../../../services/task.service';
import { TaskCreateDto } from '../../../models/task-create.dto';
import { Task } from '../../../models/task.model';

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

  //---------------------------------------------------------------------------
  //  Reactive Form – definierar kontroller + validering
  //-------------------------------------------------------------------------
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium', Validators.required],
    deadline: [new Date(), Validators.required], // default = idag
  });

  //---------------------------------------------------------------------------
  //  Lifecycle
  //---------------------------------------------------------------------------
  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId')!;
    if (this.taskId) {
      // → EDIT-läge: hämta uppgiften och patcha formuläret
      this.isEdit = true;
      this.taskService.getOne(this.taskId).subscribe(
        (t) => this.form.patchValue({ ...t, deadline: new Date(t.deadline) }) // Date-objekt till datepicker
      );
    }
  }

  //---------------------------------------------------------------------------
  //  UX-hjälp: lägg till x dagar på deadline
  //---------------------------------------------------------------------------
  plusDays(days: number) {
    const d = new Date(this.form.value.deadline!);
    d.setDate(d.getDate() + days);
    this.form.controls.deadline.setValue(d);
  }

  //---------------------------------------------------------------------------
  //  Spara – avgör create vs edit, anropar service och navigerar tillbaka
  //---------------------------------------------------------------------------
  save() {
    if (this.form.invalid) return; // stoppa om fälten ej klara

    const dto: TaskCreateDto = {
      ...this.form.getRawValue(), // title, description, etc.

      // projectId: 'p1', // koppla till projektet
      priority: 'medium',
      deadline: new Date().toISOString(),
      projectId: '',
    };

    // Välj rätt service-anrop
    const req$ = this.isEdit
      ? this.taskService.update({ id: this.taskId, ...dto } as Task)
      : this.taskService.add(dto);

    // Prenumerera och navigera tillbaka när servern svarat OK
    req$.subscribe(() =>
      this.router.navigate(
        ['/tasks', this.projectId],
        { state: { created: !this.isEdit } } // feedback-flagga till listan
      )
    );

    // this.taskService.add(dto);
    // this.router.navigate(['/task']);
  }
}
