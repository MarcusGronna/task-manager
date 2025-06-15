import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProjectService } from '../../../../services/project.service';

// --- Form-typ -------------------------------------------------------------
interface ProjectForm {
  name: FormControl<string>;
  description: FormControl<string>;
  deadline: FormControl<Date>;
}

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.scss',
})
export class ProjectAddComponent {
  private fb = inject(FormBuilder);
  private projectSvc = inject(ProjectService);
  private router = inject(Router);

  /** Typed reactive form med *förvalt datum = idag* */
  form = this.fb.nonNullable.group<ProjectForm>({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
    deadline: this.fb.nonNullable.control(new Date(), Validators.required),
  });

  /* -------------------------------------------------------------- */
  /* Hjälpknapp ± x dagar                                           */
  /* -------------------------------------------------------------- */
  shiftDeadline(days: number) {
    const current = this.form.controls.deadline.value;
    const next = new Date(current); // klona
    next.setDate(next.getDate() + days);
    this.form.controls.deadline.setValue(next);
  }

  /* -------------------------------------------------------------- */
  /* Spara                                                          */
  /* -------------------------------------------------------------- */
  save() {
    if (this.form.invalid) return;

    const dto = {
      ...this.form.getRawValue(), // name, description
      deadline: this.form.controls.deadline.value.toISOString(),
    };

    this.projectSvc.add(dto).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (err) => console.error('POST misslyckades', err),
    });
  }
}
