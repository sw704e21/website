import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import { catchError, retry } from 'rxjs/operators';
import {Crypto} from "./crypto";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";

const endpoint = "http://cryptoserver.northeurope.cloudapp.azure.com";

let headers = new HttpHeaders();
headers = headers.set('content-type', 'application/json').set( 'x-api-key', '157e82ac-4d6a-4fed-b7a7-064db24230ed');

@Injectable({
  providedIn: 'root'
})

export class CryptoServiceService {
  constructor(private http: HttpClient) { }

  getCryptocurrencies(): Observable<any> {
    return this.http.get<Crypto>(endpoint + "/coins/all").pipe(catchError(this.handleError));
  }

  getCryptocurrency(id: string): Observable<any> {
    return this.http.get<Crypto>(endpoint + '/coins/' + id).pipe(catchError(this.handleError));
  }

  getPrice(id: string, index: number): Observable<any> {
    return this.http.post("https://api.livecoinwatch.com/coins/single",
      JSON.stringify({currency: 'USD', code: id, meta: true}),
      {headers: headers});
  }

  getPriceHistory(id: string, period: number): Observable<any> {
    return this.http.post("https://api.livecoinwatch.com/coins/single/history",
      JSON.stringify({currency: 'USD', code: id, meta: false, start: Date.now() - period, end: Date.now()}),
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
