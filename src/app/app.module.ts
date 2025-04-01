import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { GamesComponent } from './games/games.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GameDetailsComponent } from './components/game-details/game-details.component';
//import { GameService } from './shared/services/game.service';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GameListComponent,
    NotFoundComponent,
    FooterComponent,
    CarouselComponent,
    GamesComponent,
    GameDetailsComponent,
    GameAddComponent,
    GameEditComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    AsyncPipe,
    MatIconModule,
    MatFormFieldModule,
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
