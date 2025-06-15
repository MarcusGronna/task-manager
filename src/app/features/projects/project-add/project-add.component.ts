import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../models/project.model';

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
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.scss',
})
export class ProjectAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectSvc = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  project!: Project;

  isEdit = false;
  private id!: string;

  // Typed reactive form med förvalt datum = idag
  form = this.fb.nonNullable.group<ProjectForm>({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
    deadline: this.fb.nonNullable.control(new Date(), Validators.required),
  });

  //  hämta & patcha om vi redigerar
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.id) {
      this.isEdit = true;
      this.projectSvc.getOne(this.id).subscribe((p) => {
        this.project = p;
        if (!p) return;
        this.form.patchValue({
          ...p,
          deadline: new Date(p.deadline),
        });
      });
    }
  }

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
      ...this.form.getRawValue(),
      deadline: this.form.controls.deadline.value.toISOString(),
      completed: this.isEdit ? this.project!.completed : false,
    };

    const req$ = this.isEdit
      ? this.projectSvc.update({ id: this.id, ...dto })
      : this.projectSvc.add(dto);

    req$.subscribe(() => this.router.navigate(['/projects']));
  }
}
