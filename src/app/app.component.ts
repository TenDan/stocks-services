import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from './services/account.service';
import {StocksService} from './services/stocks.service';
import {Stock} from './services/stocks.model';
import {AlertService} from './services/alert.service';
import 'rxjs-compat/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StocksService]
})
export class AppComponent implements OnInit, OnDestroy {
  refresh = true;
  stocks: Stock[] = [];
  interval: any;

  constructor(
    public accountService: AccountService,
    private stocksService: StocksService,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.accountService.init();
    this.load();

    this.interval = setInterval(() => {
      if (this.refresh) {
        this.load();
      }
    }, 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  toggleRefresh(): void {
    this.refresh = !this.refresh;
    const onOff = (this.refresh) ? 'on' : 'off';
    this.alertService.alert(`Przełączyłeś automatyczne odświeżanie ${onOff}`, 'info', 0);
  }

  reset(): void {
    this.accountService.reset();
    this.alertService.alert(`Zresetowałeś swój portfel!`);
  }

  private load(): void {
    this.stocksService.getStocks().subscribe(
      (stocks) => this.stocks = stocks,
      error => console.error(`There was an error loading stocks: ${error}`));
  }

}
