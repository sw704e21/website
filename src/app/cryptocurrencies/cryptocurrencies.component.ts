import { Component, OnInit } from '@angular/core';
import { Crypto} from "../crypto";
import {CRYPTOCURRENCIES} from "../mockDB";

@Component({
  selector: 'app-cryptocurrencies',
  templateUrl: './cryptocurrencies.component.html',
  styleUrls: ['./cryptocurrencies.component.css']
})
export class CryptocurrenciesComponent implements OnInit {

  CryptoList = CRYPTOCURRENCIES;
  displayedColumns: string[] = ['id', 'name', 'price', 'mentions', 'mentionsPercent', 'pos', 'neg', 'pos-neg'];
  dataSource = CRYPTOCURRENCIES;

  constructor() { }

  ngOnInit(): void {
  }

}
