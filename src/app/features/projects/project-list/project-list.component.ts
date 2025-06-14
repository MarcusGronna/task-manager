import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatListModule, MatChipsModule, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  projects$ = this.projectService.getAll();
}
