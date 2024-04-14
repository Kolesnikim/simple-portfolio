import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TotalValueChartResponse } from '../../api/portfolio-overview/types/TotalValueChartResponse';
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { Duration } from 'dayjs/plugin/duration';
import { WalletValueService } from './services/wallet-value.service';
import { ChartDataService } from './services/chart-data.service';
import { ChartComponent } from './components/chart/chart.component';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { TimeRanges } from '../../core/types/TimeRange';
import { TotalProfitsAndLosses } from '../../api/portfolio-overview/interfaces/TotalProfitsAndLosses';
import { HighlightProfitLossDirective } from '../../shared/directives/highlight-profit-loss.directive';
import { AddressEllipsisPipe } from '../../shared/pipes/address-ellipsis.pipe';
import { MatIcon } from '@angular/material/icon';
import { ChartSeries } from '../../core/types/ChartSeries';

@Component({
  selector: 'app-wallet-value',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    ChartComponent,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    CurrencyPipe,
    DecimalPipe,
    HighlightProfitLossDirective,
    AddressEllipsisPipe,
    MatIcon,
  ],
  providers: [WalletValueService, ChartDataService],
  templateUrl: './wallet-value.component.html',
  styleUrl: './wallet-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletValueComponent implements OnInit {
  protected readonly TimeRanges = TimeRanges;

  totalValueChart$?: Observable<TotalValueChartResponse | null>;
  totalProfitAndLoss$?: Observable<TotalProfitsAndLosses | null>;

  chartData$?: Observable<ChartSeries | null>;
  duration$?: Observable<Duration | null>;

  timerange: TimeRanges = TimeRanges['1year'];
  currentWalletAddress?: string;

  constructor(
    private walletValueService: WalletValueService,
    private chartDataService: ChartDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadChartData();

    this.initComponentParams();
  }

  loadChartData(value: TimeRanges = TimeRanges['1year']) {
    this.walletValueService.loadChartData(this.route.snapshot.params['id'], value);
  }

  private initComponentParams() {
    this.totalValueChart$ = this.walletValueService.totalValueChart$;
    this.totalProfitAndLoss$ = this.walletValueService.totalProfitAndLoss$;

    this.chartData$ = this.chartDataService.chartData$;
    this.duration$ = this.chartDataService.duration$;

    this.currentWalletAddress = this.route.snapshot.params['id'];
  }
}
