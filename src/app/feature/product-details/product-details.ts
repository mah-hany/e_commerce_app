import { Component, inject, signal, WritableSignal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart_sevice/cart-service';
import { ProductCard } from '../../core/services/product_card/product-card';
import { IProduct, IReview } from '../../core/modules/IProduct/iproduct';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  private route= inject(ActivatedRoute);
  private router= inject(Router);
  private readonly productsService= inject(ProductCard);
  private readonly cartService= inject(CartService);
  private readonly platformId= inject(PLATFORM_ID);

  product:         WritableSignal<IProduct | null> = signal(null);
  relatedProducts: WritableSignal<IProduct[]>      = signal([]);
  selectedImage:   WritableSignal<string>          = signal('');
  quantity:        WritableSignal<number>          = signal(1);
  activeTab:       WritableSignal<string>          = signal('details');
  isLoading:       WritableSignal<boolean>         = signal(false);
  addingToCart:    WritableSignal<boolean>         = signal(false);
  errorMessage:    WritableSignal<string>          = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) this.loadProduct(id);
      });
    }
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.quantity.set(1);
    this.activeTab.set('details');
    this.product.set(null);

    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.selectedImage.set(res.data.imageCover);
        // this.loadRelated(res.data.category._id);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to load product.');
        this.isLoading.set(false);
      }
    });
  }

  // loadRelated(categoryId: string): void {
  //   this.productsService.getProductsByCategory(categoryId).subscribe({
  //     next: (res) => {
  //       const currentId = this.product()?._id;
  //       this.relatedProducts.set(
  //         res.data.filter((p: IProduct) => p._id !== currentId).slice(0, 10)
  //       );
  //     }
  //   });
  // }

  selectImage(img: string): void {
    this.selectedImage.set(img);
  }

  increaseQty(): void {
    const max = this.product()?.quantity ?? 99;
    if (this.quantity() < max) this.quantity.update(v => v + 1);
  }

  decreaseQty(): void {
    if (this.quantity() > 1) this.quantity.update(v => v - 1);
  }

  addToCart(productId: string): void {
    this.addingToCart.set(true);
    this.cartService.addToCart(productId).subscribe({
      next: () => this.addingToCart.set(false),
      error: () => this.addingToCart.set(false),
    });
  }

  toggleWishlist(productId: string): void {
    console.log('Toggle wishlist:', productId);
  }

  goToProduct(productId: string): void {
  this.router.navigate(['/productdetails', productId]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
 }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  get reviews(): IReview[] {
    return this.product()?.reviews ?? [];
  }

}
