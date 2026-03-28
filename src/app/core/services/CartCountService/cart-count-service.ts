// core/services/cart_count/cart-count.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })


export class CartCountService {
  cartCount:     WritableSignal<number> = signal(0);
  wishlistCount: WritableSignal<number> = signal(0);
}