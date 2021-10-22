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

  chart = new Chart()

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  getPriceWeek(): void {
    let tempData: number[] = [];
    let tempDate: number[] = [];
    this.cryptoServiceService.getPriceWeek(this.route.snapshot.paramMap.get("id")!)
      .subscribe(resp => { for (let i = 0; i < resp.history.length; i++){
        tempData.push(resp.history[i].rate);
        tempDate.push(resp.history[i].date);
      };
        this.chart.addSeries({
        name: 'Price',
        type: 'line',
        data: tempData,
        pointStart: tempDate[0],
        pointInterval: 3600 * 1000 * 1.68
      }, true, true);
      });


    //console.log(tempData);

    //this.printFunction()

    //this.priceData.push(1);

  }

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
      xAxis: {
        type: 'datetime'
      },
      plotOptions: {
        series: {
          marker:{
            enabled: false
          }
        }
      }
    });
  }



}
