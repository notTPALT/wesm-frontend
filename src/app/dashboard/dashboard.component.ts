import { Component, inject, Input, ResourceStatus } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SensorDataService } from '../../services/sensor-data.service';
import { lastValueFrom } from 'rxjs';
import { WaterData } from '../../interfaces/water-data';
import { RoomBriefComponent } from '../room-brief/room-brief.component';
import { ElectricityBriefComponent } from '../electricity-brief/electricity-brief.component';
import { WaterBriefComponent } from '../water-brief/water-brief.component';

@Component({
  imports: [RoomBriefComponent, ElectricityBriefComponent, WaterBriefComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private sensorDataService: SensorDataService = inject(SensorDataService); 
  public waterDatas!: WaterData;

  private async getWaterData() {
    try {
      this.waterDatas = this.waterDatas || {};
      const result = await lastValueFrom(this.sensorDataService.getWaterInfo('node_1', 'water1'));
      if (result) {
        this.waterDatas.node_id = result[0].node_id;
        this.waterDatas.sensor_id = result[0].sensor_id;
        this.waterDatas.water = result[0].water;
        var a = document.getElementById("total-water");
        if (a && this.waterDatas.water) a.textContent = this.waterDatas.water.toString();
      } else {
        console.error('Result is undefined or not an array with data');
      }

    } catch (error) {
      console.error('Error fetching water data:', error);
    }

  }

  constructor() {
    this.getWaterData();
  }
  
  
}
