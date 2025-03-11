export interface GameDTO {
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice?: number;
  showFullDescription: boolean;
  showImage?: boolean;
}
