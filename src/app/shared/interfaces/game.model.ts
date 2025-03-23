export interface Game {
  id: number;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice?: number;
  platforms: string[];
  genre?: string;
  showOnFirstPage?: boolean;
  showFullDescription?: boolean;
  rating?: number;
}
