import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MyaccountService {
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
 
  // Update logged user data (name, email, phone)
  updateProfile(data: { name: string; email: string; phone: string }): Observable<any> {
    return this.http.put<any>(
      `${environment.baseUrl}/api/v1/users/updateMe`,
      data,
      { headers: this.headers }
    );
  }
 
  changePassword() {
    console.warn('changePassword method not implemented yet');
  }
}
