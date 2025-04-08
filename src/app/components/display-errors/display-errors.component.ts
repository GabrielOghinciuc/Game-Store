import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-errors',
  templateUrl: './display-errors.component.html',
  styleUrl: './display-errors.component.scss',
})
export class DisplayErrorsComponent {
  @Input({ required: true })
  errors!: string[];
}
