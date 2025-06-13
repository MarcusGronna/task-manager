import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.scss',
})
export class ProjectAddComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    deadline: ['', Validators.required],
  });

  save() {
    if (this.form.invalid) return;
    const dto = {
      ...this.form.getRawValue(),
      deadline: new Date(this.form.value.deadline!).toISOString(),
    };

    // updatera state + POST
    this.projectService.add(dto).subscribe({
      next: () => this.router.navigate(['/projects']), // navigera tillbaka till listan
      error: (err) => console.error('POST misslyckades', err),
    });
  }
}
