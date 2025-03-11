import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private games: Game[] = [
    {
      id: 1,
      name: 'The Witcher 3: Wild Hunt',
      description: 'A role-playing game set in a lush fantasy world.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0NmaQTdhZFrHr1LTS4INvRRal3lIFkDA6h1tDbWxE8ROoc-UMeeddafgF5Y9QdPqHV3ZVA',
      originalPrice: 15,
      discountedPrice: 8,
      showFullDescription: false,
      showOnFirstPage: true,
    },
    {
      id: 2,
      name: 'Cyberpunk 2077',
      description: 'An open-world RPG in a dystopian future.',
      image:
        'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
      originalPrice: 15,
      discountedPrice: 8,
      showFullDescription: false,
      showOnFirstPage: true,
    },
    {
      id: 3,
      name: 'Red Dead Redemption 2',
      description: 'An epic tale of life in America’s unforgiving heartland.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQyXi1Jjdtp7_Pqp7_lK7OjGc5x2pwcD70FadC9sCmbzx4wRisjwYW944IXXHTwqSL16Ru',
      originalPrice: 15,
      discountedPrice: 8,
      showFullDescription: false,
      showOnFirstPage: true,
    },
    {
      id: 4,
      name: 'Grand Theft Auto V',
      description:
        'Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the seventh main entry in the Grand Theft Auto series, following 2008 s Grand Theft Auto IV',
      image:
        'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
      originalPrice: 20,
      discountedPrice: 5,
      showFullDescription: false,
      showOnFirstPage: true,
    },
    {
      id: 5,
      name: 'Minecraft',
      description:
        'Minecraft is a 2011 sandbox game developed and published by Mojang Studios. Originally created by Markus "Notch" Persson using the Java programming language, the first public test build was released on 17 May 2009.',
      image:
        'https://www.minecraft.net/content/dam/games/minecraft/key-art/Vanilla-PMP_Collection-Carousel-0_The-Wild-Update_1280x768.jpg',
      originalPrice: 15,
      discountedPrice: 8,
      showFullDescription: false,
      showOnFirstPage: true,
    },
    {
      id: 6,
      name: 'Counter Strike 2',
      description:
        'Counter-Strike is a series of multiplayer tactical first-person shooter video games in which teams of terrorists battle to perpetrate an act of terror while counter-terrorists try to prevent it. The series began on Windows in 1999 with the release of the first game, Counter-Strike',
      image:
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1719426374',
      originalPrice: 15,
      discountedPrice: 8,
      showFullDescription: false,
      showOnFirstPage: true,
    },
  ];

  getGames(): Game[] {
    return this.games.filter((game) => game.showOnFirstPage);
  }

  getGamesForFirstPage(): Game[] {
    return this.games.filter((game) => game.showOnFirstPage);
  }
}
