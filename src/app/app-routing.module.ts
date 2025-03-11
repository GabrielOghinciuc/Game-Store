import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GamesComponent } from './games/games.component';

const routes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'games', component: GamesComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
