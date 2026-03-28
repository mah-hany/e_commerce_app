import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Iwishlist } from '../../modules/iwishlist/iwishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
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
 
  getWishlist(): Observable<Iwishlist> {
    return this.http.get<Iwishlist>(
      `${environment.baseUrl}/api/v1/wishlist`,
      { headers: this.headers }
    );
  }
 
  addToWishlist(productId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/api/v1/wishlist`,
      { productId },
      { headers: this.headers }
    );
  }
 
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.baseUrl}/api/v1/wishlist/${productId}`,
      { headers: this.headers }
    );
  }



}
