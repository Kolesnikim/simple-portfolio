import { Injectable } from '@angular/core';
import { Api } from '../base/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PortfolioParams } from './interfaces/TotalValueChartParams';
import { TotalValueChartResponse } from './types/TotalValueChartResponse';

@Injectable({
  providedIn: 'root',
})
export class PortfolioOverviewApiService extends Api {
  domain = 'portfolio/overview';

  constructor(private http: HttpClient) {
    super();
  }

  getDataForTotalValueChart(params: PortfolioParams): Observable<TotalValueChartResponse> {
    return this.http.get<TotalValueChartResponse>(
      this.buildBaseUrl(environment.devApiUrl, 'total_value_chart'),
      {
        params: this.params(params),
      }
    );
  }

  getTotalProfitAndLoss(params: PortfolioParams): Observable<unknown> {
    return this.http.get(this.buildBaseUrl(environment.publicApiUrl, 'total_profit_and_loss'), {
      params: this.params(params),
    });
  }

  private buildBaseUrl(apiUrl: string, input: string): string {
    return `${apiUrl}/${this.domain}/${input}`;
  }
}
