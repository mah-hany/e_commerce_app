import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ICartItem } from '../modules/icart/icart';
import { CartService } from '../services/cart_sevice/cart-service';
import { CheckoutService } from '../services/CheckoutService/checkout-service';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
 
  cartItems:      WritableSignal<ICartItem[]> = signal([]);
  totalCartPrice: WritableSignal<number>      = signal(0);
  cartId:         WritableSignal<string|null> = signal(null);
  selectedPayment: WritableSignal<string>     = signal('cash');
  isLoading:      WritableSignal<boolean>     = signal(false);
  errorMessage:   WritableSignal<string>      = signal('');

  checkoutForm: FormGroup = this.fb.group({
    city:    ['', Validators.required],
    details: ['', Validators.required],
    phone:   ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]]
  });
 
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }
  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems.set(res.data.products);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.cartId.set(res.cartId);
      },
      error: () => {}
    });
  }
  selectPayment(method: string): void {
    this.selectedPayment.set(method);
  }
  placeOrder(): void {
    if (this.checkoutForm.invalid || !this.cartId()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
 
    this.isLoading.set(true);
    this.errorMessage.set('');
 
    const shippingAddress = this.checkoutForm.value;
    const cartId = this.cartId()!;
 
    if (this.selectedPayment() === 'cash') {
      this.checkoutService.cashOrder(cartId, shippingAddress).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Failed to place order. Please try again.');
        }
      });
    } 
    else {
      this.checkoutService.onlineOrder(cartId, shippingAddress).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          // Redirect to Stripe payment URL
          if (isPlatformBrowser(this.platformId) && res.session?.url) {
            window.location.href = res.session.url;
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Failed to initiate payment. Please try again.');
        }
      });
    }
  }

}
