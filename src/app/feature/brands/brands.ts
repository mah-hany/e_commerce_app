import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BrandsService } from '../../core/services/brands_service/brands-service';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.html',
  styleUrl: './brands.css',
})
export class Brands implements OnInit {

  private readonly brandsService=inject(BrandsService);

  brandslist: WritableSignal<any> = signal([])

  ngOnInit(): void {
    this.getbrands();
  }

  getbrands(): void {
    this.brandsService.getbrands().subscribe({
      next: (res) => {
        this.brandslist.set(res.data);
        console.log('all products', this.brandslist());
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
