import { DestroyRef, Injectable } from '@angular/core';
import { PortfolioOverviewApiService } from '../../../api/portfolio-overview/portfolio-overview.service';
import { TimeRange } from '../../../core/types/TimeRange';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TotalValueChartResponse } from '../../../api/portfolio-overview/types/TotalValueChartResponse';

@Injectable()
export class WalletValueService {
  private readonly totalValueChart = new BehaviorSubject<TotalValueChartResponse | null>(null);
  private readonly totalProfitAndLoss = new BehaviorSubject<unknown | null>(null);

  totalValueChart$ = this.totalValueChart.asObservable();
  totalProfitAndLoss$ = this.totalProfitAndLoss.asObservable();

  constructor(
    private portfolioOverviewApiService: PortfolioOverviewApiService,
    private destroyRef: DestroyRef
  ) {}

  initChartData(id: string, timerange: TimeRange) {
    combineLatest([
      this.portfolioOverviewApiService.getDataForTotalValueChart({
        addresses: id,
        timerange: timerange,
      }),
      this.portfolioOverviewApiService.getTotalProfitAndLoss({
        addresses: id,
        timerange: timerange,
      }),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef), tap(console.log))
      .subscribe(([chartData, total]: [TotalValueChartResponse, unknown]) => {
        this.totalValueChart.next(chartData);
        this.totalProfitAndLoss.next(total);
      });
  }
}
