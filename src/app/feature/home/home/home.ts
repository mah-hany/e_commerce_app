import { Component, OnInit, signal, WritableSignal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite/lib/esm/components';
import { FlowbiteService } from '../../../core/services/flowbite.service/flowbite.service';
import { Category } from '../../../core/services/category/category';
import { ICategory } from '../../../core/modules/ICategory/icategory';
import { ProductCard } from '../../../core/services/product_card/product-card';
import { IProduct } from '../../../core/modules/IProduct/iproduct';
import { NgClass, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/WishlistService/wishlist-service';
import { CartService } from '../../../core/services/cart_sevice/cart-service';
import { CartCountService } from '../../../core/services/CartCountService/cart-count-service';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private flowbiteService  = inject(FlowbiteService);
  private categoryService  = inject(Category);
  private productService   = inject(ProductCard);
  private wishlistService  = inject(WishlistService);
  private cartService      = inject(CartService);
  cartCountService         = inject(CartCountService); // public for template

  private platformId       = inject(PLATFORM_ID);

  // Signals
  categories:  WritableSignal<ICategory[]> = signal([]);
  productList: WritableSignal<IProduct[]>  = signal([]);
  wishlistIds: WritableSignal<string[]>    = signal([]);
  cartProductIds: WritableSignal<string[]> = signal([]);
  addingToCartId: WritableSignal<string>   = signal('');

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => { initFlowbite(); });

    if (isPlatformBrowser(this.platformId)) {
      this.getAllCategories();
      this.getAllProducts();
      this.getWishlistIds();
      this.getCartCount();  // ← load cart count on open
    }
  }

  getAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data),
      error: (err) => console.error(err),
    });
  }

  getAllProducts(): void {
    this.productService.getproducts().subscribe({
      next: (res) => this.productList.set(res.data),
      error: (err) => console.error(err),
    });
  }

  // Load cart count on page open
  getCartCount(): void {
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cartCountService.cartCount.set(res.numOfCartItems);
      // store IDs of products already in cart
      this.cartProductIds.set(
        res.data.products.map((item: any) => item.product._id)
      );
    },
    error: () => {}
  });
 }

  // Load wishlist IDs + sync navbar badge
  getWishlistIds(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistIds.set(res.data.map(item => item._id));
        this.cartCountService.wishlistCount.set(res.count); // ← sync badge
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Toggle wishlist + update badge
  toggleWishlist(productId: string): void {
    const isWishlisted = this.wishlistIds().includes(productId);

    if (isWishlisted) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds.update(ids => ids.filter(id => id !== productId));
          this.cartCountService.wishlistCount.update(v => Math.max(0, v - 1)); // ← decrement
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds.update(ids => [...ids, productId]);
          this.cartCountService.wishlistCount.update(v => v + 1); // ← increment
        }
      });
    }
  }

  addToCart(productId: string): void {
  if (this.cartProductIds().includes(productId)) return; // already added

  this.addingToCartId.set(productId);
  this.cartService.addToCart(productId).subscribe({
    next: (res) => {
      this.cartProductIds.update(ids => [...ids, productId]); // mark as added
      this.cartCountService.cartCount.set(res.numOfCartItems); // update badge
      this.addingToCartId.set('');
    },
    error: () => this.addingToCartId.set(''),
  });
 }

  goToCategory(id: string): void {
    // navigate to category
  }

}

