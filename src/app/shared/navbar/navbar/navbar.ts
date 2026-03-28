import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite/lib/esm/components';
import { FlowbiteService } from '../../../core/services/flowbite.service/flowbite.service';
import { Router, RouterLink } from '@angular/router';
import { CartCountService } from '../../../core/services/CartCountService/cart-count-service';
import { AuthService } from '../../../core/services/auth_service/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  private flowbiteService = inject(FlowbiteService);
  private authService     = inject(AuthService);
  private router          = inject(Router);
  private platformId      = inject(PLATFORM_ID);

  cartCountService = inject(CartCountService);

  searchQuery: string = '';

  isLoggedIn: WritableSignal<boolean> = signal(false);
  userName:   WritableSignal<string>  = signal('');

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => { initFlowbite(); });

    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(this.authService.isLoggedIn());
      this.userName.set(this.authService.getUserName());
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.cartCountService.cartCount.set(0);
    this.cartCountService.wishlistCount.set(0);
    this.router.navigate(['/login']);
  }

}


