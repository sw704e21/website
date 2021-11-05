import {Component, OnInit, ViewChild} from '@angular/core';
import {Crypto} from "../crypto";
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CryptoServiceService} from "../crypto-service.service";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-cryptocurrencies',
  templateUrl: './cryptocurrencies.component.html',
  styleUrls: ['./cryptocurrencies.component.css']
})
export class CryptocurrenciesComponent implements OnInit {

  cryptoList: Crypto[] = []
  displayedColumns: string[] = ['id', 'name', 'price', 'mentions', 'mentionsPercent', 'pos', 'neg', 'pos-neg'];

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) {}

  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit(): void {
    this.getCryptocurrencies();
  }

  //Gets currencies for the table on the frontpage
  getCryptocurrencies(): void {
    this.cryptoServiceService.getCryptocurrencies().subscribe(resp => {
      this.cryptoList = resp;
      //Placeholder till the backend supports token ID
      for (var i = 0; i < this.cryptoList.length; i++){

        this.cryptoList[i].id = resp[i].identifier;
        this.getPrice(this.cryptoList[i].id, i);

      }
    })
  }

  getPrice(id: string, index: number): void{
    this.cryptoServiceService.getPrice(id, index).subscribe(resp => this.cryptoList[index].price = resp.rate.toPrecision(5))
  }


  sortData($event: Sort) {
    this.sortByPrice()
    console.log(this.cryptoList)
    //this.reverseCrypto();
  }

  sortByPrice(){
    this.cryptoList.sort((obj1, obj2) => {
      if (obj1.price > obj2.price) {
        return 1;
      }
      if (obj1.price < obj2.price) {
        return -1;
      }

      return 0
    });
  }

  reverseCrypto(){
    this.cryptoList.reverse()
    this.table.renderRows()
  }
}
