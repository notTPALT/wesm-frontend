import { Component } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-water-brief',
  imports: [BaseChartDirective],
  templateUrl: './water-brief.component.html',
  styleUrl: './water-brief.component.css',
})
export class WaterBriefComponent {
  public chartLabels: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];
  // Water chart data
  public waterData: ChartData<'bar'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Water (m³)',
        data: [10, 12, 8, 15, 11, 13, 14],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Water chart options
  public waterOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'm³' },
      },
      x: {
        title: { display: true, text: 'Day' },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
}
