import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectFilterPipe } from '../../../shared/pipes/project-filter.pipe';

import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatListModule,
    MatChipsModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatFormField,
    MatLabel,
    MatButtonToggleModule,
    ProjectFilterPipe,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  searchCtrl = new FormControl('');
  selectedStatus: 'all' | 'active' | 'done' = 'all';
  projects$ = this.projectService.projects$;
  private router = inject(Router); // lägg till detta

  constructor() {
    // trigga initial laddning en gång
    this.projectService.getAll().subscribe();
  }

  goToTasks(id: string) {
    this.router.navigate(['/projects', id, 'tasks']);
  }

  // Tar bort projektet och uppdaterar listan lokalt
  remove(id: string) {
    this.projectService.remove(id).subscribe();
  }
}
