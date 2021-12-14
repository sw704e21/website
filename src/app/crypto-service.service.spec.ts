import {fakeAsync, TestBed} from '@angular/core/testing';

import { CryptoServiceService } from './crypto-service.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Crypto} from "./crypto";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

describe('CryptoServiceService', () => {
  let service: CryptoServiceService;
  let httpTestingController: HttpTestingController;
  let actualCrypto: Crypto[];
  let actualError: HttpErrorResponse | undefined;


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

    let mockParams = new HttpParams()
      .set('length', 3)
      .set('sortParam', '-mentions')
    const expectedUrl: string = 'http://cryptoserver.northeurope.cloudapp.azure.com/coins/all?length=3&sortParam=-mentions'
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

  it('#getCryptocurrencies should throw correct error response', function (done: DoneFn) {
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
      expect(actualError.error).toBe(errorEvent);
      expect(actualError.status).toBe(status);
      expect(actualError.statusText).toBe(statusText);
    });
});
