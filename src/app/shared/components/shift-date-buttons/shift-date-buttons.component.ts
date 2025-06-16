import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shift-date-buttons',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './shift-date-buttons.component.html',
  styleUrls: ['./shift-date-buttons.component.scss'],
})
export class ShiftDateButtonsComponent {
  // Aktuellt datum som ska flyttas
  @Input({ required: true }) date!: Date;

  // Emitteras när nytt datum räknats fram
  @Output() shift = new EventEmitter<number>();

  emitShift(days: number) {
    this.shift.emit(days); // <-- sänder bara antalet dagar
  }
}
