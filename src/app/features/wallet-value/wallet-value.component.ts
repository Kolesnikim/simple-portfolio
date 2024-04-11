import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { TotalValueChartResponse } from '../../api/portfolio-overview/types/TotalValueChartResponse';
import { AsyncPipe, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import dayjs from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { WalletValueService } from './services/wallet-value.service';
import { ChartDataService } from './services/chart-data.service';

@Component({
  selector: 'app-wallet-value',
  standalone: true,
  imports: [AreaChartModule, NgIf, AsyncPipe],
  providers: [DatePipe, CurrencyPipe, WalletValueService, ChartDataService],
  templateUrl: './wallet-value.component.html',
  styleUrl: './wallet-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletValueComponent implements OnInit {
  duration?: Duration;

  totalValueChart$?: Observable<TotalValueChartResponse | null>;
  totalProfitAndLoss$?: Observable<unknown | null>;
  chartData$?: Observable<unknown>;

  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  constructor(
    private walletValueService: WalletValueService,
    private chartDataService: ChartDataService,
    private route: ActivatedRoute,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.walletValueService.initChartData(this.route.snapshot.params['id'], '1year');

    this.totalValueChart$ = this.walletValueService.totalValueChart$;
    this.totalProfitAndLoss$ = this.walletValueService.totalProfitAndLoss$;
    this.chartData$ = this.chartDataService.chartData$;
    // const x = dayjs(chartData[0].timestamp * 1000);
    // const y = dayjs(chartData[chartData.length - 1].timestamp * 1000);
    //
    // this.duration = dayjs.duration(y.diff(x));
  }

  onSelect(event: any) {
    console.log(event);
  }

  xAxisTickFormatting = (value: Date) => {
    let formattingLiteral = '';

    // @ts-ignore
    if (this.duration?.months() > 1 || this.duration?.years()) {
      formattingLiteral = 'MMM YYYY';
    } else if (this.duration?.months() === 0) {
      formattingLiteral = 'dd MMM';
    } else if (this.duration?.days() === 0) {
      formattingLiteral = 'hh:mm';
    }

    return this.datePipe.transform(value, formattingLiteral);
  };

  yAxisTickFormatting = (value: number) => {
    return this.currencyPipe.transform(value, 'USD', 'symbol-narrow', '1.0-2');
  };
}
