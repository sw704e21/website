import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import { catchError, retry } from 'rxjs/operators';
import {Crypto} from "./crypto";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";

const endpoint = "http://cryptoserver.northeurope.cloudapp.azure.com";

let headers = new HttpHeaders();
headers = headers.set('content-type', 'application/json').set( 'x-api-key', '157e82ac-4d6a-4fed-b7a7-064db24230ed');

// Time intervals for retrieving the history of a crypto
enum TimeInterval {
  Day = 86400000,
  Week = 604800000,
  Month = 2629743000,
  ThreeMonths = 7889229000,
  Year = 31556926000
}

@Injectable({
  providedIn: 'root'
})

export class CryptoServiceService {
  constructor(private http: HttpClient) { }

  getCryptocurrencies(): Observable<any> {
    return this.http.get<Crypto>(endpoint + "/coins").pipe(catchError(this.handleError));
  }

  getCryptocurrency(id: string): Observable<any> {
    return this.http.get<Crypto>(endpoint + '/coins/' + id).pipe(catchError(this.handleError));
  }

  getPrice(id: string, index: number): Observable<any> {
    return this.http.post("https://api.livecoinwatch.com/coins/single",
      JSON.stringify({currency: 'USD', code: id, meta: true}),
      {headers: headers});
  }

  getPriceWeek(id: string): Observable<any> {
    return this.http.post("https://api.livecoinwatch.com/coins/single/history",
      JSON.stringify({currency: 'USD', code: id, meta: false, start: Date.now() - TimeInterval.Year, end: Date.now()}),
      {headers: headers});
  }

  //Primitive error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status},`  +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
