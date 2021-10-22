import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Chart} from "angular-highcharts";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";
import {Title} from "@angular/platform-browser";
import {newArray} from "@angular/compiler/src/util";

@Component({
  selector: 'app-crypto-view',
  templateUrl: './crypto-view.component.html',
  styleUrls: ['./crypto-view.component.css']
})
export class CryptoViewComponent implements OnInit {

  ngOnInit(): void {
    this.getPriceWeek()
    this.getCryptocurrency()
  }

  currentCrypto: Crypto = {id: "Placeholder", name: "Placeholder", mentions: 200, mentionsPercent: "5", neg: 2, pos: 2, price: 100};

  priceData: number[] = [1, 2, 3];
  test: number = 2;

  chart = new Chart()

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  getPriceWeek(): void {
    let tempData: number[] = [1, 5, 10];
    this.cryptoServiceService.getPriceWeek(this.route.snapshot.paramMap.get("id")!)
      .subscribe(resp => {tempData.push(resp.history.length); console.log(tempData); this.priceData = tempData; console.log(this.priceData);

      } )

    //console.log(tempData);

    //this.printFunction()

    //this.priceData.push(1);

  }

  printFunction(): void {
    console.log(this.test)
    console.log(this.priceData.length)
    console.log(this.priceData[0])  }

  getCryptocurrency(): void {
    this.cryptoServiceService.getCryptocurrency(this.route.snapshot.paramMap.get("id")!)
      .subscribe(returnedCrypto => this.currentCrypto = returnedCrypto)

    console.log("Name: " + this.currentCrypto.name);

    this.chart = new Chart({
      chart: {
        plotBackgroundColor: '#171b26',
        backgroundColor: '#293142',
      },
      title: {
        text: this.currentCrypto.name,
        style: {
          color: '#666666'
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: '#666666'
        }
      },
      yAxis: {
        gridLineColor: '#293142',
        labels: {
          format: "${text}"
        }
      },
      series: [
       /* {
          name: 'Mentions',
          type: 'column',
          color: '#666666',
          opacity: 0.5,
          data: [1, 2, 3, 1, 5, 7, 9, 2, 3, 5, 4, 7, 2, 10, 11, 2, 9]
        },*/
        {
          name: 'Price',
          type: 'line',
          data: this.priceData
        },
      ]
    });
  }



}
