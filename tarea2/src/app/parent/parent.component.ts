import { Component } from '@angular/core';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { RightPanelComponent } from '../right-panel/right-panel.component';

@Component({
  selector: 'app-parent',
  standalone: true,   
  imports: [LeftPanelComponent, RightPanelComponent], 
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  elementos: string[] = [
    'El Quijote',
    'Cien años de soledad',
    '1984',
    'El Principito',
    'Fahrenheit 451'
  ];

  seleccionado: string | null = null;

  onSeleccionar(titulo: string) {
    this.seleccionado = titulo;
  }

  onLimpiar() {
    this.seleccionado = null;
  }
}
