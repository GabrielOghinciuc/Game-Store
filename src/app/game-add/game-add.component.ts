import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../shared/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.scss'],
})
export class GameAddComponent {
  gameForm: FormGroup;
  showErrors = false;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      discountedPrice: [''],
      showOnFirstPage: [false],
      showFullDescription: [false],
    });
  }

  onSubmit() {
    if (this.gameForm.valid) {
      const gameData = {
        ...this.gameForm.value,
        showOnFirstPage: this.gameForm.get('showOnFirstPage')?.value ?? false,
      };
      this.gameService.addGame(gameData);
      this.router.navigate(['/games']);
    } else {
      this.showErrors = true;
      // Scroll to top to show errors
      window.scrollTo(0, 0);
    }
  }
}
