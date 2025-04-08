import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent implements OnInit {
  @Input()
  maxRating: number = 5;

  starArray: number[] = [];

  @Input()
  selectedRating = 0;

  @Output()
  rated = new EventEmitter<number>();

  clickedRating = 0;

  ngOnInit(): void {
    this.clickedRating = this.selectedRating;
    this.starArray = Array(this.maxRating).fill(0);
  }

  handleMouseEnter(index: number) {
    this.selectedRating = index + 1;
  }

  handleMouseLeave() {
    if (this.clickedRating !== 0) {
      this.selectedRating = this.clickedRating;
    } else {
      this.selectedRating = 0;
    }
  }

  handleClick(index: number) {
    this.selectedRating = index + 1;
    this.clickedRating = this.selectedRating;
    this.rated.emit(this.selectedRating);
  }
}
