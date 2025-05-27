import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-electricity-brief',
  imports: [BaseChartDirective],
  templateUrl: './electricity-brief.component.html',
  styleUrl: './electricity-brief.component.css'
})
export class ElectricityBriefComponent {
  public chartLabels: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];
  // Electricity chart data
  public electricityData: ChartData<'bar'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Electricity (kWh)',
        data: [150, 180, 160, 200, 170, 190, 210],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Electricity chart options
  public electricityOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'kWh' },
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
