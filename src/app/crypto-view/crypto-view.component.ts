import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Chart} from "angular-highcharts";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";

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

  //This is the typescript file for the page that displays a specific crypto.

  currentCrypto: Crypto = {id: "Placeholder", name: "Placeholder", mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1, relSentiment: 1};

  chart = new Chart()

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  //Gets the price of the crypto, for the past week
  getPriceWeek(): void {
    let tempData: number[] = [];
    //Retrieves the ID from the URL using paramMap
    this.cryptoServiceService.getPriceWeek(this.route.snapshot.paramMap.get("id")!.toUpperCase())
      .subscribe(resp => {
        //Formats the data for the chart
        for (let i = 0; i < resp.history.length; i++){
          tempData.push(resp.history[i].rate); };
        const date = Math.floor((resp.history[resp.history.length-1].date - resp.history[0].date));
        //Adds a new series to the chart
        this.chart.addSeries({
          name: 'Price',
          type: 'line',
          data: tempData,
          pointStart: resp.history[0].date,
          pointInterval: date / resp.history.length
      }, true, true);
      });
  }

  onValChange(value: string){
    console.log(value);
  }
  //For getting the specific crypto
  getCryptocurrency(): void {
    //NOT a recursive call. Calling the endpoint from our service file
    this.cryptoServiceService.getCryptocurrency(this.route.snapshot.paramMap.get("id")!)
      .subscribe(returnedCrypto => this.currentCrypto = returnedCrypto)

    this.drawChart();
  }

  //Draws the chart
  drawChart(): void {
    this.chart = new Chart({
      chart: {
        plotBackgroundColor: '#171b26',
        backgroundColor: '#293142',
      },
      title: {
        text: this.route.snapshot.paramMap.get("id")!.toUpperCase(),
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
