import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Chart, StockChart} from "angular-highcharts";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";
import {Highcharts} from "highcharts/modules/stock";

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
        }
      }
    }
  })

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  initSeries(): void {
    this.chart.addSeries({
      name: 'Price',
      type: 'line',
      data: []
    }, true, true)
    this.getPriceHistory(TimeInterval.Week)
  }

  //Gets the price of the crypto, for the past week
  getPriceHistory(period: number): void {
    let tempData: number[] = [];
    //Retrieves the ID from the URL using paramMap
    this.cryptoServiceService.getPriceHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), period)
      .subscribe(resp => {
        //Formats the data for the chart
        for (let i = 0; i < resp.history.length; i++){
          tempData.push(resp.history[i].rate); }

        console.log(tempData.length)
        const date = (resp.history[resp.history.length-1].date - resp.history[0].date);
        this.chart.ref.series[0].setData(tempData, true, true, true);
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
