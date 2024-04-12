import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { Duration } from 'dayjs/plugin/duration';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [AreaChartModule],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @Input() chartData: unknown;
  @Input() duration!: Duration | null;

  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

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
