import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoViewComponent } from './crypto-view.component';
import {ActivatedRoute} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CryptoServiceService} from "../crypto-service.service";
import {of} from "rxjs";
import {Crypto} from "../crypto";
import {MatTableModule} from "@angular/material/table";
import {CryptocurrenciesComponent} from "../cryptocurrencies/cryptocurrencies.component";
import * as Highcharts from 'highcharts';

describe('CryptoViewComponent', () => {
  let component: CryptoViewComponent;
  let fixture: ComponentFixture<CryptoViewComponent>;

  const fakeActivatedRoute = {
    snapshot: {paramMap: {get(): string { return '123';}}}
  }
  const fakeCryptoList: Crypto[] = [
    {
      "name": 'Chainlink',
      "mostInteractions": 990,
      "mentions": 908,
      "posSentiment": 685.8186,
      "mostInfluence": 1516971,
      "id": "LINK",
      "negSentiment": 59.2391,
      "relSentiment": 10.577127268982816,
      "relMentions": 90800,
      "displayName": "Chainlink",
      "icon": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/link.webp",
      "price": 18.278077021528727,
      "price_score": 5,
      "social_score": 2.5,
      "average_sentiment": 5,
      "correlation_rank": 3.8,
      "final_score": 67
    },
    {
      "name": 'Solana',
      "mostInteractions": 855,
      "mentions": 745,
      "posSentiment": 611.2964,
      "mostInfluence": 3141619,
      "id": "SOL",
      "negSentiment": 43.1778,
      "relSentiment": 13.157655091273755,
      "relMentions": 18525,
      "displayName": "Solana",
      "icon": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/sol.webp",
      "price": 155.6242137671368,
      "price_score": 5,
      "social_score": 2.6,
      "average_sentiment": 5,
      "correlation_rank": 2.7,
      "final_score": 1
    },
    {
      "name": 'Bitcoin',
      "mostInteractions": 855,
      "mentions": 745,
      "posSentiment": 611.2964,
      "mostInfluence": 39,
      "id": "BTC",
      "negSentiment": 43.1778,
      "relSentiment": 13.157655091273755,
      "relMentions": 18525,
      "displayName": "Bitcoin",
      "icon": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/sol.webp",
      "price": 155.6242137671368,
      "price_score": 5,
      "social_score": 2.6,
      "average_sentiment": 5,
      "correlation_rank": 2.7,
      "final_score": 1
    }
  ];
  const fakePriceList: number[] = [1.156,2.25,3.45,4.785,5.54,6.3,7.15];
  const fakeCryptoHistory: [mentions: number, interactions: number, posSent: number, negSent: number] = [100, 54, 4.5, 1.3]
  const fakeCryptoInfo: Crypto = {id: "TestID", icon: "TestIcon", name: "TestName", displayName: "TestDisplayName",
    mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100.75465, mostInfluence: 1, mostInteractions: 1,
    relSentiment: 1, average_sentiment: 1, final_score: 50, price_score: 1, social_score: 1, correlation_rank: 1};

  const MockCryptoService: Pick<CryptoServiceService, keyof CryptoServiceService> = {
    getCryptocurrencies: jasmine.createSpy('getCryptocurrencies').and.returnValue(of(fakeCryptoList)), //Not used but have to be there
    getPriceHistory: jasmine.createSpy('getPriceHistory').and.returnValue(of(fakePriceList)),
    getCryptoHistory: jasmine.createSpy('getCryptoHistory').and.returnValue(of(fakeCryptoHistory)),
    getCryptoInfo: jasmine.createSpy('getCryptoInfo').and.returnValue(of(fakeCryptoInfo)),
    getSearchResult: jasmine.createSpy('getSearchResult') //Not used but have to be there

  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTableModule],
      declarations: [ CryptoViewComponent ],
      providers: [
        CryptoViewComponent,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: CryptoServiceService, useValue: MockCryptoService}
      ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
