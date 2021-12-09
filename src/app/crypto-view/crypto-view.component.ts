import {Chart} from "angular-highcharts";
declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {CryptoServiceService} from "../crypto-service.service";
import {Crypto} from "../crypto";
import {HttpParams} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import {coerceStringArray} from "@angular/cdk/coercion";
const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);

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

  private chart: any;
  private wordcloud: any;

  ngOnInit(): void {
    // Render the highcharts to the html
    this.chart = Highcharts.chart('chartDiv', {
      chart: {
        // Edit chart spacing
        spacingBottom: 0,
        spacingTop: 10,
        spacingLeft: 0,
        spacingRight: 0,

        plotBackgroundColor: '#171b26',
        backgroundColor: '#29314200',
        type: 'line'
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      yAxis: [
        // Mentions axis
        {
        gridLineColor: '#293142',
        labels: {
          format: "{text}",
          style: {
            color: '#FFFFFF'
          }
        },
        title: {
          style: {
            color: '#fbc6a4',
            fontWeight: 'bold',
          },
          text: "Mentions"
        },
        visible: true
      },
       // Price axis
        {
        gridLineColor: '#293142',
        labels: {
          format: "${text}",
          style: {
            color: '#FFFFFF'
          }
        },
        title: {
          style: {
            color: '#cab8ff',
            fontWeight: 'bold',
          },
          text: "Price"
        },
        opposite: true,
        visible: false
      },
      // Interactions axis
        {
        gridLineColor: '#293142',
        labels: {
          format: "{text}",
          style: {
            color: '#FFFFFF'
          }
        },
        title: {
          style: {
            color: '#B5DEFF',
            fontWeight: 'bold',
          },
          text: "Interactions"
        },
        opposite: true,
        visible: false
      },
        // Sentiment axis
        {
        gridLineColor: '#293142',
        labels: {
          format: "{text}",
          style: {
            color: '#FFFFFF'
          }
        },
        title: {
          style: {
            color: '#C1FFD7',
            fontWeight: 'bold',
          },
          text: "Sentiment"
        },
        visible: false
      }],
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            color: '#FFFFFF'
          }
        }
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          },
        }
      },
    }, )
    this.wordcloud = Highcharts.chart('wordcloudDiv',{
      chart: {
        // Edit chart spacing
        spacingBottom: 0,
        spacingTop: 10,
        spacingLeft: 0,
        spacingRight: 0,

        plotBackgroundColor: '#171b2600',
        backgroundColor: '#29314200',
        type: 'wordcloud'
      },
      series: [{
        type: 'wordcloud',
        data: [],
        name: ''
      }],
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            // Functionality for when the word is clicked
            events: {
              click: this.sortPosts.bind(this)
            }
          }
        }
      }
    }, )

    this.initSeries();
    this.getCryptoInfo();
    this.getTFDict();

    (<any>window).twttr.widgets.load();
  }

  //This is the typescript file for the page that displays a specific crypto.

  cryptoInfo: Crypto = {id: "Placeholder", icon: "Placeholder", name: "Placeholder", displayName: "Placeholder",
    mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1,
    relSentiment: 1, average_sentiment: 1, final_score: 50, price_score: 1, social_score: 1, correlation_rank: 1};
  // Reddit posts
  redditLinkRef: string = '?ref_source=embed&amp;ref=share&amp;embed=true&amp;showmedia=false&amp;theme=dark'
  redditPosts: SafeUrl[] = []
  // Twitter posts
  twitterLinkRef: string = '?ref_src=twsrc%5Etfw'
  twitterPosts: SafeUrl[] = []

  // Word dictionary
  tfDict: [name: string,weight: number,occurences:string[]][] = []

  constructor(private route: ActivatedRoute, private location: Location, private cryptoServiceService: CryptoServiceService, private sanitizer: DomSanitizer) {}

  //Crypto history parameter
  historyParams = new HttpParams()
    .set('age', 7)

  initSeries(): void {
    //Add the price series to the graph. Index 0
    this.chart.addSeries({
      name: 'Price',
      type: 'line',
      color: '#cab8ff',
      yAxis: 1,
      data: [],
      visible: false,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
        valuePrefix: '$'
      }
    }, true, true)

    //Add the mentions series to the graph. Index 1
    this.chart.addSeries({
      name: 'Mentions',
      color: '#fbc6a4',
      type: 'line',
      yAxis: 0,
      data: [],
      visible: true
    }, true, true)

    //Add the interactions series to the graph. Index 2
    this.chart.addSeries({
      name: 'Interactions',
      type: 'line',
      yAxis: 2,
      data: [],
      color: '#B5DEFF',
      visible: false
    }, true, true)

    //Add the positive sentiment series to the graph. Index 3
    this.chart.addSeries({
      name: "PosSentiment",
      type: 'bar',
      yAxis: 3,
      color: '#C1FFD74d',
      borderColor: '#00000000',
      zIndex: -10,
      data: [],
      visible: false,
      tooltip: {
        pointFormat: 'Sentiment: ' + '<b>{point.y}</b>'
      }
    }, true, true)

    //Add the negative sentiment series to the graph. Index 4
    this.chart.addSeries({
      name: "NegSentiment",
      type: 'bar',
      yAxis: 3,
      color: '#ff78784d',
      borderColor: '#00000000',
      zIndex: -10,
      data: [],
      visible: false,
      tooltip: {
        pointFormat: 'Sentiment: ' + '<b>{point.y}</b>'
      }
    }, true, true)

    //Add the sentiment series to the graph. Index 3
    this.chart.addSeries({
      name: 'Sentiment',
      color: '#FF0000',
      type: 'bar',
      data: [],
      visible: false
    }, true, true)
    this.getCryptoHistory(this.historyParams)
    this.getPriceHistory(TimeInterval.Week)
  }

  // Gets the price of the crypto, for the past week
  getPriceHistory(period: number) {
    let tempData: number[] = [];

    //Retrieves the ID from the URL using paramMap
    this.cryptoServiceService.getPriceHistory(this.route.snapshot.paramMap.get("id")!.toUpperCase(), period)
      .subscribe(resp => {
        //Formats the data for the chart
        for (let i = 0; i < resp.history.length; i++){
          tempData.push(resp.history[i].rate);
          tempData[i] = tempData[i] > 1
              ? parseFloat(tempData[i].toFixed(2))
              : parseFloat(tempData[i].toPrecision(4))
        }

        const date = (resp.history[resp.history.length-1].date - resp.history[0].date);
        this.chart.series[0].update({
          type: "line",
          pointStart: resp.history[0].date,
          pointInterval: date / resp.history.length,
        });

        this.chart.series[0].setData(tempData, true, true, true);
      });
  }

  // Get the history for a specific crypto
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
          tempPosSentiment.push(parseFloat(resp[i].posSentiment.toFixed(3)))
          tempNegSentiment.push(-resp[i].negSentiment.toFixed(3))
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
        this.chart.series[1].setData(tempMentions, true, true, true)
        this.chart.series[2].setData(tempInteractions, true, true, true)
        this.chart.series[3].setData(tempPosSentiment, true, true, true)
        this.chart.series[4].setData(tempNegSentiment, true, true, true)
        //his.chart.ref.series[5].setData(tempSentiment, true, true, true)
      });
  }

  // Gets all the info related to a specific crypto
  getCryptoInfo(): void {
    this.cryptoServiceService.getCryptoInfo(this.route.snapshot.paramMap.get("id")!)
      .subscribe(resp => {this.cryptoInfo = resp; this.cryptoInfo.id = resp.identifier;
        this.cryptoInfo.icon = this.cryptoInfo.icon.replace("32","64");
        this.cryptoInfo.price = parseFloat(this.cryptoInfo.price > 1
          ? this.cryptoInfo.price.toFixed(2)
          : this.cryptoInfo.price.toPrecision(4));
      })
  }

  // Get the tfdict for a specific coin, and display it in the wordcloud
  getTFDict(): void{
    let tempDict: [name: string, weight: number, occurences: string[]][] = []
    let tempUrl: string[] = []
    this.cryptoServiceService.getTFDict(this.route.snapshot.paramMap.get("id")!)
      .subscribe(resp => {
        for(let key in resp){
          tempDict.push([key.toString(), resp[key].total, resp[key].occurences])
        }

        // Sort by value
        tempDict.sort(function (a, b) {
          return b[1] - a[1];
        });

        tempDict = tempDict.slice(0, 100)

        this.tfDict = tempDict
        this.wordcloud.series[0].setData(tempDict)

        // Get the posts for the most common keyword
        this.sortPosts(this.route.snapshot.paramMap.get("id"))
      })
  }

  // Updates the series option for each series
  updateCryptoSeries(period: number, numPoints: number): void{
    // Mentions series
    this.chart.series[1].update({
      type: 'line',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Interaction series
    this.chart.series[2].update({
      type: 'line',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Positive sentiment series
    this.chart.series[3].update({
      type: 'bar',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
    // Negative sentiment series
    this.chart.series[4].update({
      type: 'bar',
      pointStart: Date.now() - period,
      pointInterval: period / numPoints
    })
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
  // Change which series to display on the graph
  onSeriesToggle(id: string){

    switch (id){
      case 'Price':
        this.chart.yAxis[1].update({visible: !this.chart.series[0].visible});
        this.chart.series[0].update({visible: !this.chart.series[0].visible, type: 'line'});
        break;
      case 'Mentions':
        this.chart.yAxis[0].update({visible: !this.chart.series[1].visible});
        this.chart.series[1].update({visible: !this.chart.series[1].visible, type: 'line'})
        break;
      case 'Interactions':
        this.chart.yAxis[2].update({visible: !this.chart.series[2].visible});
        this.chart.series[2].update({visible: !this.chart.series[2].visible, type: 'line'})
        break;
      case 'Sentiment':
        this.chart.yAxis[3].update({visible: !this.chart.series[3].visible});
        this.chart.series[3].update({visible: !this.chart.series[3].visible, type: 'bar'})
        this.chart.series[4].update({visible: !this.chart.series[4].visible, type: 'bar'})
        break;
    }

  }

  // Pipes the url such that it bypasses security
  cleanUrl(url: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  sortPosts(obj: any){
    let tempArrTwi: SafeUrl[] = []
    let tempArrRed: SafeUrl[] = []

    // Get the URL to all occurences of the word
    let occs: string[];

    if (typeof obj == 'string'){
      console.log("I am a string!")
      occs = this.tfDict.filter(x => x[0] == obj)[0][2]
    } else {
      console.log("I am NOT a string!")
      occs = this.tfDict.filter(x => x[0] == obj.point.name)[0][2]
    }
    console.log(this.tfDict[0][2])

    // Split the urls into reddit and twitter arrays
    for (let key in occs){
      if(key.includes('twitter')){
        tempArrTwi.push(this.cleanUrl(key + this.twitterLinkRef))
      }
      else if (key.includes('reddit.com')){

        tempArrRed.push(this.cleanUrl(key.replace("reddit.com", "redditmedia.com")+this.redditLinkRef))
      }
    }
    this.twitterPosts = tempArrTwi
    this.redditPosts = tempArrRed
  }
}
