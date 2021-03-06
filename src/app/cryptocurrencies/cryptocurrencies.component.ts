import {Component, ElementRef, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Crypto} from "../crypto";
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CryptoServiceService} from "../crypto-service.service";
import {MatCell, MatColumnDef, MatTable} from "@angular/material/table";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-cryptocurrencies',
  templateUrl: './cryptocurrencies.component.html',
  styleUrls: ['./cryptocurrencies.component.css']
})
export class CryptocurrenciesComponent implements OnInit {

  cryptoList: Crypto[] = []
  priceCache: [string, Number][] = []
  displayedColumns: string[] = ['name', 'momentum', 'price', 'mentions', 'mentionsPercent', 'interactions', 'pos-neg'];

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) {}

  @ViewChild(MatTable) table: MatTable<any>;

  @ViewChild('finalScore') finalScore: ElementRef;

  params = new HttpParams()
    .set('length', 25)
    .set('sortParam', '-final_score')

  ngOnInit(): void {
    this.getCryptocurrencies(this.params);

  }

  //Gets currencies for the table on the frontpage
  getCryptocurrencies(params: HttpParams): void {
    this.cryptoServiceService.getCryptocurrencies(params).subscribe(resp => {
      this.cryptoList = resp;
      for (var i = 0; i < this.cryptoList.length; i++){
        this.cryptoList[i].id = resp[i].identifier;
        this.cryptoList[i].icon = resp[i].icon;
        this.cryptoList[i].price = resp[i].price > 1 ? resp[i].price.toFixed(2): resp[i].price.toPrecision(4);
      }
        this.table.renderRows();
    })

  }


  sortData(sortParam: string) {
    this.params = new HttpParams()
      .set('length', 25)
      .set('sortParam', sortParam);

    this.getCryptocurrencies(this.params);

  }
}
