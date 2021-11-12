import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";
import {Highcharts} from "highcharts/modules/stock";
import {Chart} from "angular-highcharts";
import {HttpParams} from "@angular/common/http";
import {PERIOD} from "@angular/cdk/keycodes";
import {MatCheckboxChange} from "@angular/material/checkbox";

// Time intervals for retrieving the history of a crypto
enum TimeInterval {
  Day = 86400000,
  Week = 604800000,
  Month = 2592000000,
  ThreeMonths = 7776000000,
  Year = 31536000000
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
      enabled: false
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
      visible: false
    }, true, true)

    //Add the mentions series to the graph. Index 1
    this.chart.addSeries({
      name: 'Mentions',
      color: '#1d5d1d',
      type: 'bar',
      borderColor: '#1d5d1d',
      data: [],
      visible: true
    }, true, true)

    //Add the interactions series to the graph. Index 2
    this.chart.addSeries({
      name: 'Interactions',
      type: 'line',
      data: [],
      visible: false
    }, true, true)

    //Add the positive sentiment series to the graph. Index 3
    this.chart.addSeries({
      name: "PosSentiment",
      type: 'bar',
      color: '#2AA62A',
      borderColor: '#2aa62a',
      data: [],
      visible: false
    }, true, true)

    //Add the negative sentiment series to the graph. Index 4
    this.chart.addSeries({
      name: "NegSentiment",
      type: 'bar',
      color: '#a81e1e',
      borderColor: '#A81E1E',
      data: [],
      visible: false
    }, true, true)

    //Add the sentiment series to the graph. Index 3
    this.chart.addSeries({
      name: 'Sentiment',
      color: '#FF0000',
      borderColor: '#FF0000',
      type: 'bar',
      data: [],
      visible: false
    }, true, true)
    this.getCryptoHistory(this.historyParams)
    this.getPriceHistory(TimeInterval.Week)
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
    let tempInteractions: number[] = [];
    let tempPosSentiment: number[] = [];
    let tempNegSentiment: number[] = [];
    //let tempSentiment: number[] = [];

    //Retrieve the ID from the URL using parammap
    this.cryptoServiceService.getCryptoHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), params)
      .subscribe(resp => {
        for (let i = 0; i < resp.length; i++){
          tempMentions.push(resp[i].mentions);
          tempInteractions.push(resp[i].interaction);
          tempPosSentiment.push(resp[i].posSentiment)
          tempNegSentiment.push(-resp[i].negSentiment)
          //tempSentiment.push(resp[i].sentiment);
        }

        // Reverse the data. First element in resp is the newest data point when it should be the last.
        tempMentions.reverse();
        tempInteractions.reverse();
        tempPosSentiment.reverse();
        tempNegSentiment.reverse();
        //tempSentiment.reverse();

        // Set the earliest data point we have on the graph
        let maxPeriod = resp[resp.length-1].time *60*60*1000
        this.updateCryptoSeries(maxPeriod, resp.length)

        // Set the data for each series, gotten from the response
        this.chart.ref.series[1].setData(tempMentions, true, true, true)
        this.chart.ref.series[2].setData(tempInteractions, true, true, true)
        this.chart.ref.series[3].setData(tempPosSentiment, true, true, true)
        this.chart.ref.series[4].setData(tempNegSentiment, true, true, true)
        //his.chart.ref.series[5].setData(tempSentiment, true, true, true)
      });
  }

  // Updates the series option for each series
  updateCryptoSeries(period: number, numPoints: number): void{
    // Mentions series
    this.chart.ref.series[1].update({
      type: 'bar',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Interaction series
    this.chart.ref.series[2].update({
      type: 'line',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Positive sentiment series
    this.chart.ref.series[3].update({
      type: 'bar',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Negative sentiment series
    this.chart.ref.series[4].update({
      type: 'bar',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Sentiment series
    /*this.chart.ref.series[5].update({
      type: 'bar',
      color: '#0066FF',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })*/
  }

  // Changes how far back to display the data
  onPeriodChange(value: string){
    switch (value) {
      case "Day":
        this.getPriceHistory(TimeInterval.Day);
        this.getCryptoHistory(this.historyParams.set('age', 1))
        break;
      case "Week":
        this.getPriceHistory(TimeInterval.Week);
        this.getCryptoHistory(this.historyParams.set('age', 7))
        break;
      case "Month":
        this.getPriceHistory(TimeInterval.Month);
        this.getCryptoHistory(this.historyParams.set('age', 30))
        break;
      case "3Months":
        this.getPriceHistory(TimeInterval.ThreeMonths);
        this.getCryptoHistory(this.historyParams.set('age', 90))
        break;
      case "Year":
        this.getPriceHistory(TimeInterval.Year);
        this.getCryptoHistory(this.historyParams.set('age', 365))
        break;
    }
  }
  //For getting the specific crypto
  getCryptocurrency(): void {
    //NOT a recursive call. Calling the endpoint from our service file
    this.cryptoServiceService.getCryptocurrency(this.route.snapshot.paramMap.get("id")!)
      .subscribe(returnedCrypto => this.currentCrypto = returnedCrypto)
  }

  checkboxEvent(event: MatCheckboxChange, id: string){
    console.log(event.checked + ": " + id)

    switch (id){
      case 'Price':
        this.chart.ref.series[0].update({visible: event.checked, type: 'line'})
        break;
      case 'Mentions':
        this.chart.ref.series[1].update({visible: event.checked, type: 'bar'})
        break;
      case 'Interactions':
        this.chart.ref.series[2].update({visible: event.checked, type: 'line'})
        break;
      case 'Sentiment':
        this.chart.ref.series[3].update({visible: event.checked, type: 'bar'})
        this.chart.ref.series[4].update({visible: event.checked, type: 'bar'})
        //Total sentiment
        //this.chart.ref.series[5].update({visible: event.checked, type: 'bar'})
        break;
    }

  }

  resizeChart(){
    this.chart.ref.setSize(200, 200, true);
  }

}
