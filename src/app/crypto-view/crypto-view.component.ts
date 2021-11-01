import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Chart} from "angular-highcharts";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";

// Time intervals for retrieving the history of a crypto
enum TimeInterval {
  Day = 86400000,
  Week = 604800000,
  Month = 2629743000,
  ThreeMonths = 7889229000,
  Year = 31556926000
}

@Component({
  selector: 'app-crypto-view',
  templateUrl: './crypto-view.component.html',
  styleUrls: ['./crypto-view.component.css']
})

export class CryptoViewComponent implements OnInit {

  ngOnInit(): void {
    this.getPriceHistory(TimeInterval.Week)
    this.getCryptocurrency()
  }

  //This is the typescript file for the page that displays a specific crypto.

  currentCrypto: Crypto = {id: "Placeholder", name: "Placeholder", mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1, relSentiment: 1};

  chart = new Chart()

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService) { }

  //Gets the price of the crypto, for the past week
  getPriceHistory(period: number): void {
    let tempData: number[] = [];
    //Retrieves the ID from the URL using paramMap
    this.cryptoServiceService.getPriceHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), period)
      .subscribe(resp => {
        //Formats the data for the chart
        for (let i = 0; i < resp.history.length; i++){
          tempData.push(resp.history[i].rate); };
        const date = Math.floor((resp.history[resp.history.length-1].date - resp.history[0].date));
        this.chart.removeSeries(0)
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
    });
  }

}
