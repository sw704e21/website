import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CryptocurrenciesComponent } from './cryptocurrencies/cryptocurrencies.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from '@angular/material/sidenav';
import { CryptoViewComponent } from './crypto-view/crypto-view.component';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [
    AppComponent,
    CryptocurrenciesComponent,
    CryptoViewComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
