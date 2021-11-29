import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {CryptoServiceService} from "./crypto-service.service";
import {delay} from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cryptopinion';
  searchWord: string = "";
  tokenIdentifier: [identifier: string, display_name: string, icon: string][] = [];
  displaySearchResults: string = 'none';
  maxSearchResultSize: number = 5;
  hoverSearchResults: boolean = false;

  constructor(private cryptoServiceService: CryptoServiceService, private route: ActivatedRoute) {
  }

  //Send query to the api when the user searches for something
  getSearchResult(searchQuery: string): void {
    this.cryptoServiceService.getSearchResult(searchQuery).subscribe(resp => {
      this.tokenIdentifier.length = 0;
      for (var i = 0; i < (resp.length < this.maxSearchResultSize ? resp.length : this.maxSearchResultSize); i++) {
        this.tokenIdentifier.push([resp[i].identifier, resp[i].display_name, resp[i].icon]);
      }
    })
  }

  // Called when the user writes in the search field. Called for every new input.
  search() {
    if (this.searchWord.length >= 1) {
      this.getSearchResult(this.searchWord)
    } else {
      this.tokenIdentifier.length = 0;
    }
  }

  // Called when the user enters the search field
  onFocus() {
    this.searchWord = "";
    this.search()
    this.displaySearchResults = 'block';
  }

  // Called when the user leaves the search field
  onBlur() {
    if (!this.hoverSearchResults){
      this.displaySearchResults = 'none';
      this.tokenIdentifier.length = 0;
    }
  }

  reloadPage(param: string) {
    window.location.assign('../crypto/' + param)
  }
}
