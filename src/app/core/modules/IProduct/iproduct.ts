export interface IProduct {
  sold:              number;
  images:            string[];
  subcategory:       Subcategory[];
  ratingsQuantity:   number;
  _id:               string;
  title:             string;
  slug:              string;
  description:       string;
  quantity:          number;
  price:             number;
  priceAfterDiscount?: number;
  imageCover:        string;
  category:          Category;
  brand:             Category;
  ratingsAverage:    number;
  createdAt:         string;
  updatedAt:         string;
  id:                string;
  reviews:           IReview[];       // ← added
}

export interface IReview {
  _id:       string;
  review:    string;
  rating:    number;
  product:   string;
  user: {
    _id:  string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id:   string;
  name:  string;
  slug:  string;
  image: string;
}

interface Subcategory {
  _id:      string;
  name:     string;
  slug:     string;
  category: string;
}
