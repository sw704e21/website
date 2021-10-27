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

  cryptoList: Crypto[] = []
  displayedColumns: string[] = ['id', 'name', 'price', 'mentions', 'mentionsPercent', 'pos', 'neg', 'pos-neg'];

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) {}


  ngOnInit(): void {
    this.getCryptocurrencies();
  }

  getCryptocurrencies(): void {
    this.cryptoServiceService.getCryptocurrencies().subscribe(resp => {
      this.cryptoList = resp;
      this.cryptoList[0].id = "BTC";
      for (var i = 0; i < this.cryptoList.length; i++){

        this.getPrice(this.cryptoList[i].id, i)

      }
    })

  }

  getPrice(id: string, index: number): void{
    this.cryptoServiceService.getPrice(id, index).subscribe(resp => this.cryptoList[index].price = resp.rate.toPrecision(5))
  }

}
