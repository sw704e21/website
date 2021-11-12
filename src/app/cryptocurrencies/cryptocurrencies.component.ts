import {Component, OnInit, ViewChild} from '@angular/core';
import {Crypto} from "../crypto";
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CryptoServiceService} from "../crypto-service.service";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-cryptocurrencies',
  templateUrl: './cryptocurrencies.component.html',
  styleUrls: ['./cryptocurrencies.component.css']
})
export class CryptocurrenciesComponent implements OnInit {

  cryptoList: Crypto[] = []
  priceCache: [string, Number][] = []
  displayedColumns: string[] = ['id', 'name', 'price', 'mentions', 'mentionsPercent', 'pos', 'neg', 'pos-neg'];

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) {}

  @ViewChild(MatTable) table: MatTable<any>;

  params = new HttpParams()
    .set('length', 25)
    .set('sortParam', 'mentions')

  ngOnInit(): void {
    this.getCryptocurrencies(this.params);
  }

  //Gets currencies for the table on the frontpage
  getCryptocurrencies(params: HttpParams): void {
    this.cryptoServiceService.getCryptocurrencies(this.params).subscribe(resp => {
      this.cryptoList = resp;
      //Placeholder till the backend supports token ID
      for (var i = 0; i < this.cryptoList.length; i++){
        this.cryptoList[i].id = resp[i].identifier;
        this.getPrice(this.cryptoList[i].id, i);

      }
      this.table.renderRows();
    })
  }

  getPrice(id: string, index: number): void{

    //Caching for prices. Will save many API calls.
    for (var i = 0; i < this.priceCache.length; i++){
      if(this.priceCache[i][0] === id){
        this.cryptoList[index].price = this.priceCache[i][1];
        return;
      }
    }

    this.cryptoServiceService.getPrice(id, index).subscribe(resp => {
      this.cryptoList[index].price = resp.rate > 1 ? resp.rate.toFixed(2): resp.rate.toPrecision(4);
      this.priceCache.push([id, resp.rate > 1 ? resp.rate.toFixed(2): resp.rate.toPrecision(4)])
    } )
  }


  sortData(sortParam: string) {
    this.params = new HttpParams()
      .set('length', 25)
      .set('sortParam', sortParam);

    this.getCryptocurrencies(this.params);

  }


  reverseCrypto(){
    this.cryptoList.reverse()
    this.table.renderRows()
  }
}
