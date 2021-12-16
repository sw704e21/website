import {TestBed} from '@angular/core/testing';
import { CryptoServiceService } from './crypto-service.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Crypto} from "./crypto";

describe('CryptoServiceService', () => {
  let service: CryptoServiceService;
  let httpTestingController: HttpTestingController;
  let actualError: HttpErrorResponse | undefined;

  const mockParams = new HttpParams()
    .set('length', 3)
    .set('sortParam', '-mentions')

  let actualCrypto: Crypto[];
  let actualCryptoHistory: number[];
  let actualSearchResult: [identifier: string, display_name: string, icon: string][];
  let actualCryptoInfo: Crypto;
  let actualPriceHistory: number[]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoServiceService]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CryptoServiceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCryptocurrencies should return specified amount of cryptos from observable', function (done: DoneFn) {
    // NOTE: We are only testing if the url and response is valid!
    // We are not testing the returned value as that is component test!
    const expectedUrl: string = 'http://cryptoserver.northeurope.cloudapp.azure.com/coins/all?length=3&sortParam=-mentions';
    const expectedCrypto: Crypto[] = [
      {
        "name": '',
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
        "name": '',
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
        "name": '',
        "mostInteractions": 855,
        "mentions": 745,
        "posSentiment": 611.2964,
        "mostInfluence": 39,
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
      }
    ]

    service.getCryptocurrencies(mockParams).subscribe(value => {
      actualCrypto = value;
      done()
    });
    // request.flush mocks a return on the api.
    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedCrypto);

    expect(actualCrypto).toEqual(expectedCrypto);
  });

  it('#getCryptoHistory should return the history of a crypto', function (done: DoneFn) {
    // NOTE: We are only testing if the url and response is valid!
    // We are not testing the returned value as that is component test!
    const id: string = 'BTC'
    const expectedUrl: string = 'http://cryptoserver.northeurope.cloudapp.azure.com/coins/BTC/?length=3&sortParam=-mentions';
    const expectedCryptoHistory: number[] = [3,6,5,6,3,4,5]

    service.getCryptoHistory(id, mockParams).subscribe(value => {
      actualCryptoHistory = value;
      done();
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedCryptoHistory);

    expect(actualCryptoHistory).toEqual(expectedCryptoHistory)
  });

  it('#getSearchResult should return a list of crypto that match the search result', function (done: DoneFn) {
    // NOTE: We are only testing if the url and response is valid!
    // We are not testing the returned value as that is component test!

    const searchQuery: string = 'B'
    const expectedUrl: string = 'http://cryptoserver.northeurope.cloudapp.azure.com/coins/search/B';
    const expectedSearchResult: [identifier: string, display_name: string, icon: string][] = [
      ['BTC', 'Bitcoin', ''],
      ['BNB', 'Binance Coin', ''],
      ['SHIB', 'Shiba Inu', ''],
      ['BAN', 'Banano', ''],
    ];

    service.getSearchResult(searchQuery).subscribe(value => {
      actualSearchResult = value;
      done();
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedSearchResult)

    expect(actualSearchResult).toEqual(expectedSearchResult);
  });

  it('#getCryptoInfo should return all info related to a specific crypto', function (done: DoneFn){
    // NOTE: We are only testing if the url and response is valid!
    // We are not testing the returned value as that is component test!

    const id: string = 'BTC';
    const expectedUrl: string = 'http://cryptoserver.northeurope.cloudapp.azure.com/coins/BTC/info';
    const expectedCryptoInfo: Crypto = {id: "Placeholder", icon: "Placeholder", name: "Placeholder", displayName: "Placeholder",
      mentions: 200, relMentions: 1, negSentiment: 2, posSentiment: 2, price: 100, mostInfluence: 1, mostInteractions: 1,
      relSentiment: 1, average_sentiment: 1, final_score: 50, price_score: 1, social_score: 1, correlation_rank: 1};

    service.getCryptoInfo(id).subscribe(value => {
      actualCryptoInfo = value;
      done();
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedCryptoInfo);

    expect(actualCryptoInfo).toEqual(expectedCryptoInfo);
  });

  it('#getPriceHistory should return the price over a specified time interval', function (done: DoneFn){
    // NOTE: We are only testing if the url and response is valid!
    // We are not testing the returned value as that is component test!

    const id: string = 'BTC';
    const period: number = 604800000; // 1 week in unix time
    const expectedUrl: string = 'https://api.livecoinwatch.com/coins/single/history';
    const expectedPriceHistory: number[] = [0,4,3,2,5,3,3,4,5,6,7];

    service.getPriceHistory(id, period).subscribe(value => {
      actualPriceHistory = value;
      done();
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedPriceHistory);

    expect(actualPriceHistory).toEqual(expectedPriceHistory);
  })

  /*it('#getCryptocurrencies should throw correct error response', function (done: DoneFn) {
    const status = 500;
    const statusText = 'Server error';
    const errorEvent = new ErrorEvent('API error');

    let mockParams = new HttpParams()
      .set('length', 3)
      .set('sortParam', '-mentions')

    service.getCryptocurrencies(mockParams).subscribe(
      () => {
          fail('next handler must not be called');
          done();
        },
        (error) => {
          actualError = error;
          done();
        },
        () => {
          fail('complete handler must not be called');
          done();
        });

      httpTestingController.expectOne('http://cryptoserver.northeurope.cloudapp.azure.com/coins/all?length=3&sortParam=-mentions').error(errorEvent, {status, statusText});


      if (!actualError){
        throw new Error('Error needs to be defined');
      }
      expect(actualError.error).toEqual(errorEvent);
      expect(actualError.status).toEqual(status);
      expect(actualError.statusText).toEqual(statusText);
    }); */
});
