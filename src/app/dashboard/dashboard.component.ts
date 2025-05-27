import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorDataService } from '../../services/sensor-data.service';
import { lastValueFrom } from 'rxjs';
import { WaterData } from '../../interfaces/water-data';
import { RoomBriefComponent } from '../room-brief/room-brief.component';
import { ElectricityBriefComponent } from '../electricity-brief/electricity-brief.component';
import { WaterBriefComponent } from '../water-brief/water-brief.component';
import { RoomBriefData } from '../../interfaces/room-brief-data';
import { ElecData } from '../../interfaces/elec-data';

@Component({
  imports: [CommonModule, RoomBriefComponent, ElectricityBriefComponent, WaterBriefComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private sensorDataService: SensorDataService = inject(SensorDataService); 
  public roomsBriefData!: RoomBriefData[];

  private async getWaterUsage(index: number, date: number = -1, rows: number = 1) {
    try {
      const result = await lastValueFrom(this.sensorDataService.getWaterInfo('node_1', `water${index}`, rows, date));
      if (result) {
        return result[0].water ?? -1;
      } else {
        console.error('Result is undefined or not an array with data');
      }
    } catch (error) {
      console.error('Error fetching water data:', error);
    }

    return -1;
  }

  private async getElecUsage(index: number, date: number = -1, rows: number = 1) {
    try {
      const result = await lastValueFrom(this.sensorDataService.getElecInfo('node_2', `power${index}`, rows, date));
      if (result) {
        return result[0].power ?? -1;
      } else {
        console.error('Result is undefined or not an array with data');
      }
    } catch (error) {
      console.error('Error/Warning fetching electricity data:', error);
    }

    return -1;
  }

  private async getRoomBrief(index: number) {
    var roomBrief!: RoomBriefData;
    var pastDate: number = 1;
    try {
      roomBrief = roomBrief || {};

      roomBrief.elecPast = await this.getElecUsage(index, pastDate);
      roomBrief.elecCurrent = await this.getElecUsage(index);
      roomBrief.waterPast = await this.getWaterUsage(index, pastDate);
      roomBrief.waterCurrent = await this.getWaterUsage(index);
      roomBrief.unpaidAmount = Math.floor(Math.random() * 1000); // Idk the formula, feel free to modify this
    } catch (error) {
      console.error(`Unable to get completed data for room ${index}. Error: `, error);
    }

    return roomBrief;
  }

  // Currently there are only 2 rooms available, so it will be hardcoded.
  // Should use something like $ROOMS env variable instead.
  private async getBriefAllRooms() {
    this.roomsBriefData = this.roomsBriefData || {};
    for (let i = 1; i <= 2; i++) {
      let roomBrief: RoomBriefData = await this.getRoomBrief(i);
      this.roomsBriefData[i] = roomBrief;
    }
  }

  constructor() {
    this.getBriefAllRooms();
    console.log(this.roomsBriefData);
  }
  
  
}
