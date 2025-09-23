import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './left-panel.component.html',
})
export class LeftPanelComponent {
  @Input() elementos: string[] = [];
  @Input() seleccionado: string | null = null;
  @Output() seleccionar = new EventEmitter<string>();

  seleccionarElemento(titulo: string) {
    this.seleccionar.emit(titulo);
  }
}
