import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptocurrenciesComponent } from './cryptocurrencies.component';
import {ActivatedRoute} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CryptoServiceService} from "../crypto-service.service";
import {of} from "rxjs";
import {Crypto} from "../crypto";
import {MatTableModule} from "@angular/material/table";

describe('CryptocurrenciesComponent', () => {
  let component: CryptocurrenciesComponent;
  let fixture: ComponentFixture<CryptocurrenciesComponent>;

  const fakeActivatedRoute = {
    snapshot: {paramMap: {get(): string { return '123';}}}
  }
  let fakeCryptoList: Crypto[] = [
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

  const MockCryptoService: Pick<CryptoServiceService, 'getCryptocurrencies'> = {
    getCryptocurrencies: jasmine.createSpy('getCryptocurrencies').and.returnValue(of(fakeCryptoList)),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTableModule],
      declarations: [ CryptocurrenciesComponent ],
      providers: [
        CryptocurrenciesComponent,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: CryptoServiceService, useValue: MockCryptoService}
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptocurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getCryptocurrencies populate the table', function () {
    const fixture = TestBed.createComponent(CryptocurrenciesComponent);
    fixture.detectChanges();

    const DomTableUnderTest = document.querySelector('table#crypto-table');
    const cryptoInTable = Array.from(
      DomTableUnderTest!.getElementsByClassName('mat-row')
    )

    //Expect the right number of rows to have rendered
    expect(cryptoInTable.length).toBe(3)

    cryptoInTable.forEach(crypto => {
      const cryptoName = crypto
        .getElementsByClassName('mat-column-name')
        .item(0)!.textContent;

      // Passes if either is there. Has to do with order of the crypto list and the sorted table
      expect([fakeCryptoList[0].name, fakeCryptoList[1].name, fakeCryptoList[2].name]).toContain(cryptoName)
    })
    expect(MockCryptoService.getCryptocurrencies).toHaveBeenCalled();
  });

  it('#crypto-table renders the correct number of headers', function () {
    const fixture = TestBed.createComponent(CryptocurrenciesComponent);
    fixture.detectChanges();

    const cryptoHeaders = document.querySelectorAll('th.mat-header-cell');

    expect(cryptoHeaders.length).toBe(7);
  })

});
