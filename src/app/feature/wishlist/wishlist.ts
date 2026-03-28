import { Component, inject, signal, WritableSignal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/WishlistService/wishlist-service';
import { CartService } from '../../core/services/cart_sevice/cart-service';
import { IWishlistItem } from '../../core/modules/iwishlist/iwishlist';
import { CartCountService } from '../../core/services/CartCountService/cart-count-service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {

  private wishlistService  = inject(WishlistService);
  private cartService      = inject(CartService);
  private platformId       = inject(PLATFORM_ID);
  private cartCountService = inject(CartCountService);

  // Signals
  wishlistItems: WritableSignal<IWishlistItem[]> = signal([]);
  isLoading:     WritableSignal<boolean>         = signal(false);
  errorMessage:  WritableSignal<string>          = signal('');
  addingToCart:  WritableSignal<string>          = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getWishlist();
    }
  }

  getWishlist(): void {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data);
        this.cartCountService.wishlistCount.set(res.count); // ← sync navbar badge
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to load wishlist.');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(productId: string): void {
    this.addingToCart.set(productId);
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.addingToCart.set('');
        this.cartCountService.cartCount.set(res.numOfCartItems); // ← sync cart badge
      },
      error: () => this.addingToCart.set(''),
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.update(items =>
          items.filter(item => item._id !== productId)
        );
        this.cartCountService.wishlistCount.update(v => Math.max(0, v - 1)); // ← decrement badge
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to remove item.');
      }
    });
  }

}
