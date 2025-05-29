import { Component, EventEmitter, Output, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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
export class RoomDetailsComponent {
  @Output() close = new EventEmitter<void>();

  // Mock room data (replace with API/service in real app)
  roomData = {
    roomName: '102',
    pastElectricity: 150,
    currentElectricity: 180,
    unpaidElectricityFee: 45.50,
    pastWater: 10,
    currentWater: 12,
    unpaidWaterFee: 15.75,
    totalFee: 61.25
  };

  // Chart data for electricity (past 30 days)
  electricityChartData: ChartData<'line'> = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.random() * 10 + 5), // Random data for demo
        label: 'Electricity (kWh)',
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart data for water (past 30 days)
  waterChartData: ChartData<'line'> = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.random() * 2 + 1), // Random data for demo
        label: 'Water (m³)',
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
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
}