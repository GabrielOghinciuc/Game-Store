export interface GameDTO {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  picture?: File;
  originalPrice: number;
  discountedPrice?: number;
  rating: number;
  showFullDescription: boolean;
  showOnFirstPage: boolean;
  platforms: string[];
  genre: string;
}
