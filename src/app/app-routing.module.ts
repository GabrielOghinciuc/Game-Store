import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GamesComponent } from './games/games.component';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';
import { LoginComponent } from './auth/view/login/login.component';
import { RegisterComponent } from './auth/view/register/register.component';
import { AccountDetailsComponent } from './auth/account-details/account-details.component';
//import { AccountEditComponent } from './auth/account-edit/account-edit.component';
const routes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'add', component: GameAddComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games/details/:id', component: GameDetailsComponent },
  { path: 'games/edit/:id', component: GameEditComponent },
  { path: 'games', component: GamesComponent },
  { path: 'account/detail/:id', component: AccountDetailsComponent },
  //{ path: 'account/edit/:id', component: AccountEditComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
