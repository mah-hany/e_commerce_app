export interface IWishlistItem {
  _id:             string;
  id:              string;
  title:           string;
  slug:            string;
  description:     string;
  quantity:        number;
  price:           number;
  priceAfterDiscount?: number;
  imageCover:      string;
  images:          string[];
  sold:            number;
  ratingsAverage:  number;
  ratingsQuantity: number;
  createdAt:       string;
  updatedAt:       string;
  category: {
    _id:   string;
    name:  string;
    slug:  string;
    image: string;
  };
  subcategory: {
    _id:      string;
    name:     string;
    slug:     string;
    category: string;
  }[];
  brand: {
    _id:   string;
    name:  string;
    slug:  string;
    image: string;
  };
}

export interface Iwishlist {
  status: string;
  count:  number;
  data:   IWishlistItem[];
}