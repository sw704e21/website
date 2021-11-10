import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";
import {Highcharts} from "highcharts/modules/stock";
import {Chart} from "angular-highcharts";
import {HttpParams} from "@angular/common/http";

// Time intervals for retrieving the history of a crypto
enum TimeInterval {
  Day = 90000000,
  Week = 630000000,
  Month = 2700000000,
  ThreeMonths = 8100000000,
  Year = 32400000000
}

@Component({
  selector: 'app-crypto-view',
  templateUrl: './crypto-view.component.html',
  styleUrls: ['./crypto-view.component.css']
})

export class CryptoViewComponent implements OnInit {

  ngOnInit(): void {
    this.initSeries()
    this.getCryptocurrency()
  }

  //This is the typescript file for the page that displays a specific crypto.

  currentCrypto: Crypto = {id: "Placeholder", name: "Placeholder", mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1, relSentiment: 1};

  chart = new Chart({
    chart: {
      plotBackgroundColor: '#171b26',
      backgroundColor: '#293142',
      type: 'line'
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
        format: "${text}",
      },
      title: {
        text: null
      }
    },
    xAxis: {
      type: 'datetime'
    },
    plotOptions: {
      series: {
        marker:{
          enabled: false
        },
      }
    },
  })

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  //Crypto history parameter
  historyParams = new HttpParams()
    .set('age', 7)

  initSeries(): void {
    //Add the price series to the graph. Index 0
    this.chart.addSeries({
      name: 'Price',
      type: 'line',
      data: [],
      visible: true
    }, true, true)
    this.getPriceHistory(TimeInterval.Week)

    //Add the mentions series to the graph. Index 1
    this.chart.addSeries({
      name: 'Mentions',
      type: 'bar',
      data: [],
      visible: true
    }, true, true)
    this.getCryptoHistory(this.historyParams);
  }

  //Gets the price of the crypto, for the past week
  getPriceHistory(period: number) {
    let tempData: number[] = [];

    //Retrieves the ID from the URL using paramMap
    this.cryptoServiceService.getPriceHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), period)
      .subscribe(resp => {
        //Formats the data for the chart
        for (let i = 0; i < resp.history.length; i++){
          tempData.push(resp.history[i].rate); }

        const date = (resp.history[resp.history.length-1].date - resp.history[0].date);
        this.chart.ref.series[0].update({
          type: "line",
          pointStart: resp.history[0].date,
          pointInterval: date / resp.history.length,
        });

        this.chart.ref.series[0].setData(tempData, true, true, true);
      });
  }

  getCryptoHistory(params: HttpParams){
    let tempMentions: number[] = [];

    //Retrieve the ID from the URL using parammap
    this.cryptoServiceService.getCryptoHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), params)
      .subscribe(resp => {
        for (let i = 0; i < resp.length; i++){
          tempMentions.push(resp[i].mentions);}

        tempMentions.reverse();
        const period = parseInt(params.get('age')!)*24*60*60*1000
        this.chart.ref.series[1].update({
          type: 'bar',
          pointStart: Date.now() - period,
          pointInterval: period / resp.length
        })
        this.chart.ref.series[1].setData(tempMentions, true, true, true)
      });
  }

  // Changes how far back to display the data
  onPeriodChange(value: string){
    switch (value) {
      case "Day":
        this.getPriceHistory(TimeInterval.Day);
        break;
      case "Week":
        this.getPriceHistory(TimeInterval.Week);
        break;
      case "Month":
        this.getPriceHistory(TimeInterval.Month);
        break;
      case "3Months":
        this.getPriceHistory(TimeInterval.ThreeMonths);
        break;
      case "Year":
        this.getPriceHistory(TimeInterval.Year);
        break;
    }
  }
  //For getting the specific crypto
  getCryptocurrency(): void {
    //NOT a recursive call. Calling the endpoint from our service file
    this.cryptoServiceService.getCryptocurrency(this.route.snapshot.paramMap.get("id")!)
      .subscribe(returnedCrypto => this.currentCrypto = returnedCrypto)

  }

}
