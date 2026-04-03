import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './feature/home/home/home';
import { Shop } from './feature/shop/shop';
import { Brands } from './feature/brands/brands';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';
import { Cart } from './feature/cart/cart';
import { Notfound } from './feature/notfound/notfound';
import { Allgategories } from './feature/gategories/allgategories/allgategories';
import { SpecificGategory } from './feature/gategories/specific-gategory/specific-gategory';
import { ProductDetails } from './feature/product-details/product-details';
import { Wishlist } from './feature/wishlist/wishlist';
import { Myaccount } from './feature/myaccount/myaccount';
import { Fotgotpassword } from './core/auth/fotgotpassword/fotgotpassword';
import { Checkout } from './core/checkout/checkout';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component: Login},
    {path:'register', component: Register},
    {path:'home', component: Home},
    {path:'productdetails/:id', component: ProductDetails},
    {path: 'wishlist', component: Wishlist },
    {path: 'forgotpassword', component: Fotgotpassword },
    {path:'shop', component: Shop},
    {path:'brands', component: Brands},
    {path:'cart', component: Cart},
    {path: 'Myaccount', component: Myaccount},
    {path:'checkout', component: Checkout},
    {path:'gategory', children:[
        {path:'allgategories', component: Allgategories},
        {path:'allgategories/:id', component: SpecificGategory}
    ]},


    {path:'**', component: Notfound}
];
