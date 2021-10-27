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

  currentCrypto: Crypto = {id: "Placeholder", name: "Placeholder", mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1, relSentiment: 1};

  chart = new Chart()

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  getPriceWeek(): void {
    let tempData: number[] = [];
    this.cryptoServiceService.getPriceWeek(this.route.snapshot.paramMap.get("id")!.toUpperCase())
      .subscribe(resp => { for (let i = 0; i < resp.history.length; i++){
        tempData.push(resp.history[i].rate);
      }; const date = Math.floor((Date.now() - resp.history[0].date) / (1000*60*60)); console.log(date)
        this.chart.addSeries({
          name: 'Price',
          type: 'line',
          data: tempData,
          pointStart: resp.history[0].date,
          pointInterval: 3600 * 1000 * (date/100)
      }, true, true);
      });
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
