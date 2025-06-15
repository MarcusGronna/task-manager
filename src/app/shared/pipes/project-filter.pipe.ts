import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../../models/project.model';

@Pipe({ name: 'projectFilter', standalone: true })
export class ProjectFilterPipe implements PipeTransform {
  transform(
    projects: Project[] | null,
    term: string,
    status: 'all' | 'active' | 'done'
  ): Project[] {
    if (!projects) return [];
    const t = term.trim().toLowerCase();

    return projects.filter((p) => {
      const matchesTerm = !t || p.name.toLowerCase().includes(t);
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && !p.completed) ||
        (status === 'done' && p.completed);
      return matchesTerm && matchesStatus;
    });
  }
}
