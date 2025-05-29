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
        transform: 'translateY(-50%)'
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-100%)'
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
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.random() * 10 + 5), // Random data for demo
        label: 'Electricity (kWh)',
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart data for water (past 30 days)
  waterChartData: ChartData<'line'> = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.random() * 2 + 1), // Random data for demo
        label: 'Water (m³)',
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  onClose() {
    this.close.emit();
  }
}