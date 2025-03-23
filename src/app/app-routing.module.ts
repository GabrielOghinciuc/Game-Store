import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GamesComponent } from './games/games.component';
import { GameAddComponent } from './game-add/game-add.component';
import { GameDetailsComponent } from './game-details/game-details.component';

const routes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'add', component: GameAddComponent },
  { path: 'games/details/:id', component: GameDetailsComponent },
  { path: 'games', component: GamesComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
