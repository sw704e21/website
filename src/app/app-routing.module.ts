import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CryptoViewComponent} from "./crypto-view/crypto-view.component";
import {CryptocurrenciesComponent} from "./cryptocurrencies/cryptocurrencies.component";

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'crypto/:id', component: CryptoViewComponent },
  { path: '', component: CryptocurrenciesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
