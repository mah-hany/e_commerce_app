import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

    private http       = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
 
  private get token(): string {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || ''
      : '';
  }
 
  private get headers() {
    return { token: this.token };
  }
 
  // Cash on delivery order
  cashOrder(cartId: string, shippingAddress: { city: string; details: string; phone: string }): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/api/v1/orders/${cartId}`,
      { shippingAddress },
      { headers: this.headers }
    );
  }
 
  // Online payment order (returns Stripe session URL)
  onlineOrder(cartId: string, shippingAddress: { city: string; details: string; phone: string }): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
      { shippingAddress },
      { headers: this.headers }
    );
  }


}
