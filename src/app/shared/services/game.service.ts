/*import { Injectable } from '@angular/core';
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
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One', 'Nintendo Switch'],
      genre: 'Action RPG',
    },
    {
      id: 2,
      name: 'Cyberpunk 2077',
      description: 'An open-world RPG in a dystopian future.',
      image:
        'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
      originalPrice: 15,
      discountedPrice: 8,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Action RPG',
    },
    {
      id: 3,
      name: 'Red Dead Redemption 2',
      description: 'An epic tale of life in America’s unforgiving heartland.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQyXi1Jjdtp7_Pqp7_lK7OjGc5x2pwcD70FadC9sCmbzx4wRisjwYW944IXXHTwqSL16Ru',
      originalPrice: 15,
      discountedPrice: 8,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'Xbox One'],
      genre: 'Action Adventure',
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
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Action Adventure',
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
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'Xbox One', 'Nintendo Switch'],
      genre: 'Sandbox',
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
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC'],
      genre: 'FPS',
    },
    {
      id: 7,
      name: 'Elden Ring',
      description:
        'An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.',
      image:
        'https://static.posters.cz/image/750/postere/elden-ring-battlefield-of-the-fallen-i121753.jpg',
      originalPrice: 60,
      discountedPrice: 40,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Action RPG',
    },
    {
      id: 8,
      name: 'God of War Ragnarök',
      description:
        'Action-adventure game following Kratos and Atreus in Norse mythology.',
      image:
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRxFAMCihTSxdPuyGX6xfkqf4OKP2zKPa7Nj7Jb8eJSGUqjZj0Lto5PgmQPmSkQsV78P1pS',
      originalPrice: 70,
      discountedPrice: 50,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PS4', 'PS5'],
      genre: 'Action Adventure',
    },
    {
      id: 9,
      name: 'Horizon Forbidden West',
      description:
        'Action RPG set in a post-apocalyptic world with robotic creatures.',
      image:
        'https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WHECQJdN.png',
      originalPrice: 60,
      discountedPrice: 35,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: true,
      platforms: ['PS4', 'PS5'],
      genre: 'Action RPG',
    },
    {
      id: 10,
      name: "Assassin's Creed Valhalla",
      description: "Viking-themed action RPG in the Assassin's Creed series.",
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWfS5ajM5AxAQrcBnYhr8rWpPJOAqmN_z_eQ5trSlqBRNqpRdN2gCgkps5u3ehtBiV53OvLg',
      originalPrice: 50,
      discountedPrice: 25,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Action RPG',
    },
    {
      id: 11,
      name: 'Final Fantasy XVI',
      description: 'Latest entry in the legendary JRPG series.',
      image:
        'https://image.api.playstation.com/vulcan/ap/rnd/202211/3007/lgFVhRm5BfoX02pRUt3lSmLV.png',
      originalPrice: 70,
      discountedPrice: 55,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PS5'],
      genre: 'JRPG',
    },
    {
      id: 12,
      name: 'Resident Evil 4 Remake',
      description: 'Reimagining of the classic survival horror game.',
      image: 'https://img.youtube.com/vi/mDcVh5NJIVE/maxresdefault.jpg',
      originalPrice: 60,
      discountedPrice: 40,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Survival Horror',
    },
    {
      id: 13,
      name: 'Spider-Man 2',
      description:
        'Latest adventure featuring both Peter Parker and Miles Morales.',
      image:
        'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60eca3ac155247e21850c7d075d01ebf0f3f5dbf19ccd2a1.jpg',
      originalPrice: 70,
      discountedPrice: 60,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PS5'],
      genre: 'Action Adventure',
    },
    {
      id: 14,
      name: 'Starfield',
      description: "Bethesda's epic space exploration RPG.",
      image:
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnqaTvMn-NTktBhWB8qcQ3Lv71C8lQjas_d9DoORP_xN5w0Hv-U3La1eSFuREmgzKeCA7t_g',
      originalPrice: 70,
      discountedPrice: 55,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'Xbox One'],
      genre: 'Action RPG',
    },
    {
      id: 15,
      name: 'Diablo IV',
      description: 'Latest entry in the legendary action RPG series.',
      image:
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQu4jFYxGuslPZRKB0KpbuwZD9FvCNFHlBjoTX0vXWTB3E97ixamU3X9VbetoAPx87sabpwhQ',
      originalPrice: 70,
      discountedPrice: 50,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Action RPG',
    },
    {
      id: 16,
      name: 'Street Fighter 6',
      description: 'Latest iteration of the iconic fighting game series.',
      image:
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRXcNx2qnmS6rqvVOqqAu5sIPxVg3MK52sET9mXUwM_4JMmkC9tt7W1RUjHqxkMw3qkCoMa',
      originalPrice: 60,
      discountedPrice: 0,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Fighting',
    },
    {
      id: 17,
      name: "Baldur's Gate 3",
      description: 'Epic RPG based on Dungeons & Dragons.',
      image:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
      originalPrice: 60,
      discountedPrice: 0,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS5'],
      genre: 'RPG',
    },
    {
      id: 18,
      name: 'Lies of P',
      description: 'Soulslike game inspired by the tale of Pinocchio.',
      image:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg',
      originalPrice: 60,
      discountedPrice: 0,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
      genre: 'Soulslike',
    },
    {
      id: 19,
      name: 'Mortal Kombat 1',
      description: 'Latest entry in the brutal fighting game series.',
      image:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg',
      originalPrice: 70,
      discountedPrice: 0,
      rating: 4,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS5', 'Xbox One', 'Nintendo Switch'],
      genre: 'Fighting',
    },
    {
      id: 20,
      name: 'Alan Wake 2',
      description: 'Survival horror sequel to the cult classic.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSvXoNTBYMtV_d_kL-KECFIzBEhETK2Gt4QdJz8yIlIoB2t3HK',
      originalPrice: 60,
      discountedPrice: 0,
      rating: 5,
      showFullDescription: false,
      showOnFirstPage: false,
      platforms: ['PC', 'PS5', 'Xbox One'],
      genre: 'Survival Horror',
    },
  ];

  public getGames(): Game[] {
    return this.games;
  }

  public addGame(game: Game) {
    const newId = Math.max(...this.games.map((g) => g.id)) + 1;
    const newGame = {
      ...game,
      id: newId,
      showFullDescription: false,
      showOnFirstPage: game.showOnFirstPage ?? false,
    };
    this.games.push(newGame);
    return newGame;
  }

  public getGameById(id: number): Game | undefined {
    return this.games.find((game) => game.id === id);
  }

  public updateGameRating(gameId: number, rating: number): Game | undefined {
    const game = this.games.find((g) => g.id === gameId);
    if (game) {
      game.rating = rating;
    }
    return game;
  }
}*/
