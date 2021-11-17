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
import { HttpClientModule} from "@angular/common/http";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";


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
        MatSidenavModule,
        HttpClientModule,
        MatSortModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatIconModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
