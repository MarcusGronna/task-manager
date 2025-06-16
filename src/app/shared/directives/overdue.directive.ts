/* ------------------------------------------------------------------
   OverdueDirective  – markerar försenade och ej klara uppgifter/projekt
   ------------------------------------------------------------------ */

import {
  Directive,
  Input,
  HostBinding,
  OnChanges,
  SimpleChanges,
  computed,
} from '@angular/core';
import { Task } from '../../models/task.model';

@Directive({
  selector: '[appOverdue]',
  standalone: true,
})
export class OverdueDirective implements OnChanges {
  // Task-objektet som direktivet ska utvärdera
  @Input('appOverdue') task!: Pick<Task, 'deadline' | 'done'>;

  // Sätter CSS-klassen “overdue” på host-elementet när villkoret är sant
  @HostBinding('class.overdue') isOverdue = false;

  ngOnChanges(_: SimpleChanges): void {
    if (!this.task) return;

    const deadline = new Date(this.task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // jämför bara datum-del

    this.isOverdue = !this.task.done && deadline < today;
  }
}
