import { Component, inject, signal, WritableSignal, computed, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Icart, ICartItem } from '../../core/modules/icart/icart';
import { CartService } from '../../core/services/cart_sevice/cart-service';
import { CartCountService } from '../../core/services/CartCountService/cart-count-service';



@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private router= inject(Router);
  private readonly cartService = inject(CartService)
  private readonly cartCountService=inject(CartCountService);
  
  cartItems:      WritableSignal<ICartItem[]> = signal([]);
  numOfCartItems: WritableSignal<number>      = signal(0);
  cartId:         WritableSignal<string|null> = signal(null);
  isLoading:      WritableSignal<boolean>     = signal(false);
  errorMessage:   WritableSignal<string>      = signal('');

  totalCartPrice: WritableSignal<number> = signal(0);

  platformId = inject(PLATFORM_ID);

  isEmpty = computed(() => this.cartItems().length === 0);

   ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    this.getCart();  // only runs in browser, never on server
  }
  }
 
  getCart(): void {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems.set(res.data.products);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.numOfCartItems.set(res.numOfCartItems);
        this.cartCountService.cartCount.set(res.numOfCartItems);
        this.cartId.set(res.cartId);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to load cart.');
        this.isLoading.set(false);
      }
    });
  }
  increaseQty(item: ICartItem): void {
    const newCount = item.count + 1;
    this.cartService.updateCartItem(item.product._id, newCount).subscribe({
      next: (res) => {
        this.cartItems.set(res.data.products);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.numOfCartItems.set(res.numOfCartItems);
      }
    });
  }

  decreaseQty(item: ICartItem): void {
    if (item.count <= 1) {
      this.removeItem(item.product._id);
      return;
    }
    const newCount = item.count - 1;
    this.cartService.updateCartItem(item.product._id, newCount).subscribe({
      next: (res) => {
        this.cartItems.set(res.data.products);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.numOfCartItems.set(res.numOfCartItems);
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cartItems.set(res.data.products);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.numOfCartItems.set(res.numOfCartItems);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems.set([]);
        this.totalCartPrice.set(0);
        this.numOfCartItems.set(0);
        this.cartId.set(null);
      }
    });
  }
  checkout(): void {
    this.router.navigate(['/checkout']);
  }
 


}
