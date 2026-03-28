import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductCard } from '../../core/services/product_card/product-card';
import { IProduct } from '../../core/modules/IProduct/iproduct';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-shop',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  private readonly productService = inject(ProductCard)


  productList: WritableSignal<IProduct[]> = signal([])

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getproducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        console.log('all products', this.productList());
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
