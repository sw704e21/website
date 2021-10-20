import { Injectable } from '@angular/core';
import {CRYPTOCURRENCIES} from "./mockDB";
import {Observable, of} from "rxjs";
import {Crypto} from "./crypto";

@Injectable({
  providedIn: 'root'
})
export class CryptoServiceService {

  constructor() { }

  getCryptocurrencies(): Observable<Crypto[]> {
    return of(CRYPTOCURRENCIES);
  }

  getCryptocurrency(id: string): Observable<Crypto> {
    const crypto = CRYPTOCURRENCIES.find(c => c.id === id)!;
    return of(crypto);
  }
}
