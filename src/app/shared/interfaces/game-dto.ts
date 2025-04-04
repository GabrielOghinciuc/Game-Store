export interface GameDTO {
  id: number;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  showFullDescription: boolean;
  showOnFirstPage: boolean;
}
