import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  singin(formdata: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, formdata);
  }

  signup(formdata: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, formdata);
  }

  forgotPassword(data: { email: string }): Observable<any> {
   return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  verifyResetCode(data: { resetCode: string }): Observable<any> {
   return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
   return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getUserName(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userName') || '';
    }
    return '';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    }
  }


}
