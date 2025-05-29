import { Component, EventEmitter, Output, HostBinding, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { RoomBriefData } from '../../interfaces/room-brief-data';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20%)'
      })),
      transition(':enter', [
        animate('150ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-20%)'
        }))
      ])
    ])
  ]
})
export class RoomDetailsComponent implements OnChanges {
  @Input() roomData!: RoomBriefData;
  @Input() chartLabels!: string[];
  @Input() elecUsageChartData!: number[];
  @Input() waterUsageChartData!: number[];
  @Output() close = new EventEmitter<void>();

  // Chart data for electricity (past 30 days)
  electricityChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Electricity (kWh)',
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Chart data for water (past 30 days)
  waterChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Water (m³)',
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
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

  onClose() {
    this.close.emit();
  }

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartLabels'] || changes['elecUsageChartData']) {
      this.electricityChartData = {
        labels: this.chartLabels || [],
        datasets: [
          {
            label: 'Electricity (kWh)',
            data: this.elecUsageChartData || [],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      };
      console.log('Updated electricityChartData:', this.electricityChartData);
    }

    if (changes['chartLabels'] || changes['waterUsageChartData']) {
      this.waterChartData = {
        labels: this.chartLabels || [],
        datasets: [
          {
            label: 'Water (m³)',
            data: this.waterUsageChartData || [],
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
        ],
      };
      console.log('Updated waterUsageChartData:', this.waterUsageChartData);
    }
  }
}