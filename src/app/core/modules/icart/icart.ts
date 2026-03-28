export interface ICartItem {
  count:   number;
  price:   number;
  product: {
    _id:        string;
    title:      string;
    imageCover: string;
    category?: {
      name: string;
    };
  };
}

export interface Icart {
  status:         string;
  message:        string;
  numOfCartItems: number;
  cartId:         string | null;
  data: {
    products:       ICartItem[];
    totalCartPrice: number;
  };
}