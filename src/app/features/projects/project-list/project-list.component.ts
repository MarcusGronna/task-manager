import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatListModule,
    MatChipsModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  projects$ = this.projectService.getAll();
  private router = inject(Router); // lägg till detta

  goToTasks(id: string) {
    this.router.navigate(['/projects', id, 'tasks']);
  }

  // Tar bort projektet och uppdaterar listan lokalt
  remove(id: string) {
    this.projectService.remove(id).subscribe();
  }
}
