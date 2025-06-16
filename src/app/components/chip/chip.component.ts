import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  @Input() genre: string = '';
  @Input() selected: boolean = false;
  @Output() genreSelected = new EventEmitter<string>();

  public toggleSelection() {
    this.selected = !this.selected;
    this.genreSelected.emit(this.genre);
  }
}
