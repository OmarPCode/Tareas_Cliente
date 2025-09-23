import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './right-panel.component.html',
})
export class RightPanelComponent {
  @Input() titulo: string | null = null;
  @Output() limpiar = new EventEmitter<void>();

  onLimpiar() {
    this.limpiar.emit();
  }
}
