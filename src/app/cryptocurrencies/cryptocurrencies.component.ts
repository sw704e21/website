import { Component, OnInit } from '@angular/core';
import { Crypto} from "../crypto";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {CryptoServiceService} from "../crypto-service.service";

@Component({
  selector: 'app-cryptocurrencies',
  templateUrl: './cryptocurrencies.component.html',
  styleUrls: ['./cryptocurrencies.component.css']
})
export class CryptocurrenciesComponent implements OnInit {

  testPrice?: Number;
  cryptoList: Crypto[] = [];
  displayedColumns: string[] = ['id', 'name', 'price', 'mentions', 'mentionsPercent', 'pos', 'neg', 'pos-neg'];

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) {}


  ngOnInit(): void {
    this.getCryptocurrencies();
    this.getPrice("BTC");
  }

  getCryptocurrencies(): void {
    this.cryptoServiceService.getCryptocurrencies().subscribe(resp => this.cryptoList = resp)
  }

  getPrice(id: string): void{
    this.cryptoServiceService.getPrice(id).subscribe(resp => this.testPrice = resp.rate)
    console.log(this.testPrice);
  }

}
