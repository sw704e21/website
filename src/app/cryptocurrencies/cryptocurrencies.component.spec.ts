import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptocurrenciesComponent } from './cryptocurrencies.component';
import {ActivatedRoute} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CryptocurrenciesComponent', () => {
  let component: CryptocurrenciesComponent;
  let fixture: ComponentFixture<CryptocurrenciesComponent>;

  const fakeActivatedRoute = {
    snapshot: {paramMap: {get(): string { return '123';}}}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CryptocurrenciesComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
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
});
