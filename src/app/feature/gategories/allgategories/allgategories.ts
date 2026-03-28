import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Category } from '../../../core/services/category/category';
import { ICategory } from '../../../core/modules/ICategory/icategory';

@Component({
  selector: 'app-allgategories',
  imports: [],
  templateUrl: './allgategories.html',
  styleUrl: './allgategories.css',
})
export class Allgategories implements OnInit {

  private readonly categoryService = inject(Category)

  categories: WritableSignal<ICategory[]> = signal([])

  ngOnInit(): void {

    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        console.log('all categories', this.categories());
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

}
