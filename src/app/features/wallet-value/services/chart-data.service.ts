import { DestroyRef, Injectable, OnInit } from '@angular/core';
import { WalletValueService } from './wallet-value.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { TotalValueChartResponse } from '../../../api/portfolio-overview/types/TotalValueChartResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class ChartDataService {
  private readonly chartData = new BehaviorSubject<unknown | null>(null);

  chartData$ = this.chartData.asObservable();

  totalValueChart$?: Observable<TotalValueChartResponse | null>;

  constructor(
    private walletValueService: WalletValueService,
    private destroyRef: DestroyRef
  ) {
    this.initChartData();
  }

  private initChartData() {
    this.totalValueChart$ = this.walletValueService.totalValueChart$;

    this.totalValueChart$
      .pipe(
        filter(v => !!v),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(chartData => {
        const rawChartData = [
          {
            name: 'Total Value',
            series: chartData?.map(data => {
              return {
                name: new Date(data.timestamp * 1000),
                value: data.value_usd,
              };
            }),
          },
        ];

        this.chartData.next(rawChartData);
      });
  }
}
