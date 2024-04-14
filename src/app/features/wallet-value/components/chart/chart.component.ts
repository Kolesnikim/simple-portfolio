import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { Duration } from 'dayjs/plugin/duration';
import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { ChartSeries } from '../../../../core/types/ChartSeries';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [AreaChartModule, JsonPipe, CurrencyPipe, DatePipe],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @Input() chartData!: ChartSeries | null;
  @Input() duration!: Duration | null;

  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

  xAxisTickFormatting = (value: Date) => {
    let formattingLiteral = '';

    if (this.duration) {
      console.log(this.duration);
      if (this.duration?.months() > 1 || this.duration?.years()) {
        formattingLiteral = 'MMM YYYY';
      } else if (
        this.duration?.months() === 0 &&
        this.duration?.days() === 0 &&
        this.duration?.hours() !== 0
      ) {
        formattingLiteral = 'hh:mm';
      } else if (this.duration?.months() <= 1) {
        formattingLiteral = 'dd MMM';
      }
    }

    return this.datePipe.transform(value, formattingLiteral);
  };

  yAxisTickFormatting = (value: number) => {
    return this.currencyPipe.transform(value, 'USD', 'symbol-narrow', '1.0-2');
  };
}
