export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  image: string;
  isClosed?: boolean;
  discount?: number;
  cuisine: string;
  menu: FoodItem[];
};

export type CartItem = {
  foodItem: FoodItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
};

export type CartState = {
  items: CartItem[];
  restaurantId: string | null;
};
