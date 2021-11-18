import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cryptopinion';
  search: String = "";
  placeholder: [id: string, displayName: string, icon: string][] = [];

  ngOnInit(){
    this.placeholder.push(["BTC", "Bitcoin", 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/btc.webp'])
    this.placeholder.push(["DOGE", "DogeCoin", 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/doge.webp'])
    this.placeholder.push(["SHIB", "Shiba Inu Coin", 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/shib.webp'])
    this.placeholder.push(["SHIB", "Shiba Inu Coin", 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/shib.webp'])
  }

}
