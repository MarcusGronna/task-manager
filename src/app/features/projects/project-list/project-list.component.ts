import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [AsyncPipe, MatListModule, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  projects$ = this.projectService.getAll();
}
