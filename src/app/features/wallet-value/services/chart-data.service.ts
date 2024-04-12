import { DestroyRef, Injectable, OnInit } from '@angular/core';
import { WalletValueService } from './wallet-value.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { TotalValueChartResponse } from '../../../api/portfolio-overview/types/TotalValueChartResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Duration } from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

@Injectable()
export class ChartDataService {
  private readonly chartData = new BehaviorSubject<unknown | null>(null);
  private readonly duration = new BehaviorSubject<Duration | null>(null);

  chartData$ = this.chartData.asObservable();
  duration$ = this.duration.asObservable();

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

        if (chartData?.length) {
          const x = dayjs(chartData[0].timestamp * 1000);
          const y = dayjs(chartData[chartData.length - 1].timestamp * 1000);
          this.duration.next(dayjs.duration(y.diff(x)));
        }
      });
  }
}
