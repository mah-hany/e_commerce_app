import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Icart } from '../../modules/icart/icart';

@Injectable({ providedIn: 'root' })
export class CartService {

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

  getCart(): Observable<Icart> {
    return this.http.get<Icart>(`${environment.baseUrl}/api/v2/cart`, { headers: this.headers });
  }

  addToCart(productId: string): Observable<Icart> {
    return this.http.post<Icart>(`${environment.baseUrl}/api/v2/cart`, { productId }, { headers: this.headers });
  }

  updateCartItem(productId: string, count: number): Observable<Icart> {
    return this.http.put<Icart>(`${environment.baseUrl}/api/v2/cart/${productId}`, { count }, { headers: this.headers });
  }

  removeCartItem(productId: string): Observable<Icart> {
    return this.http.delete<Icart>(`${environment.baseUrl}/api/v2/cart/${productId}`, { headers: this.headers });
  }

  clearCart(): Observable<Icart> {
    return this.http.delete<Icart>(`${environment.baseUrl}/api/v2/cart`, { headers: this.headers });
  }

}
