import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/task.model';
export type WithDone = { completed?: boolean; name: string };

@Pipe({
  name: 'taskFilter',
  standalone: true,
})
export class TaskFilterPipe implements PipeTransform {
  transform(
    items: Task[] | null,
    term: string,
    status: 'all' | 'active' | 'done'
  ): Task[] {
    if (!items) return [];

    const t = term.trim().toLowerCase();
    return items.filter((task) => {
      const matchesTerm = !t || task.title.toLowerCase().includes(t);
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && !task.done) ||
        (status === 'done' && task.done);
      return matchesTerm && matchesStatus;
    });
  }
}
