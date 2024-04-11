import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { PortfolioOverviewApiService } from '../../api/portfolio-overview/portfolio-overview.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { TotalValueChartResponse } from '../../api/portfolio-overview/types/TotalValueChartResponse';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-wallet-value',
  standalone: true,
  imports: [AreaChartModule, NgIf],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './wallet-value.component.html',
  styleUrl: './wallet-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletValueComponent implements OnInit {
  multi: any;

  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  constructor(
    private portfolioOverviewApiService: PortfolioOverviewApiService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private cd: ChangeDetectorRef,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    combineLatest([
      this.portfolioOverviewApiService.getDataForTotalValueChart({
        addresses: this.route.snapshot.params['id'],
        timerange: '1year',
      }),
      this.portfolioOverviewApiService.getTotalProfitAndLoss({
        addresses: this.route.snapshot.params['id'],
        timerange: '1year',
      }),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef), tap(console.log))
      .subscribe(([chartData, total]: [TotalValueChartResponse, unknown]) => {
        this.multi = [
          {
            name: 'Total Value',
            series: chartData.map(data => {
              return {
                name: new Date(data.timestamp * 1000),
                value: data.value_usd,
              };
            }),
          },
        ];

        this.cd.markForCheck();
      });
  }

  onSelect(event: any) {
    console.log(event);
  }

  xAxisTickFormatting = (value: Date) => {
    return this.datePipe.transform(value, 'MMM YYYY');
  };

  yAxisTickFormatting = (value: number) => {
    return this.currencyPipe.transform(value, 'USD', 'symbol-narrow', '1.0-2');
  };
}
