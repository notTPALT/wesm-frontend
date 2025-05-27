import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorDataService } from '../../services/sensor-data.service';
import { lastValueFrom } from 'rxjs';
import { RoomBriefComponent } from '../room-brief/room-brief.component';
import { ElectricityBriefComponent } from '../electricity-brief/electricity-brief.component';
import { WaterBriefComponent } from '../water-brief/water-brief.component';
import { RoomBriefData } from '../../interfaces/room-brief-data';

@Component({
  imports: [
    CommonModule,
    RoomBriefComponent,
    ElectricityBriefComponent,
    WaterBriefComponent,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private sensorDataService: SensorDataService = inject(SensorDataService);
  public roomsBriefData: RoomBriefData[] = [];
  public waterUsageLast30Days: number = -1;
  public elecUsageLast30Days: number = -1;

  // The following functions assume that the sensors only send data to database once a day.
  // Beware of that.
  private async getWaterUsage(index: number, date: number = -1) {
    try {
      const result = await lastValueFrom(
        this.sensorDataService.getWaterInfo('node_1', `water${index}`, date)
      );
      if (result) {
        return result;
      } else {
        console.error('Result is undefined or not an array with data');
      }
    } catch (error) {
      console.error('Error fetching water data:', error);
    }

    return [];
  }

  private async getElecUsage(index: number, date: number = -1) {
    try {
      const result = await lastValueFrom(
        this.sensorDataService.getElecInfo('node_2', `power${index}`, date)
      );
      if (result) {
        return result;
      } else {
        console.error('Result is undefined or not an array with data');
      }
    } catch (error) {
      console.error('Error/Warning fetching electricity data:', error);
    }

    return [];
  }

  private async getRoomBrief(index: number) {
    var roomBrief!: RoomBriefData;
    var pastDate: number = 1;
    try {
      roomBrief = roomBrief || {};

      roomBrief.elecPast =
        (await this.getElecUsage(index, pastDate))[0].power ?? -1;
      roomBrief.elecCurrent = (await this.getElecUsage(index))[0].power ?? -1;
      roomBrief.waterPast =
        (await this.getWaterUsage(index, pastDate))[0].water ?? -1;
      roomBrief.waterCurrent = (await this.getWaterUsage(index))[0].water ?? -1;
      roomBrief.unpaidAmount = Math.floor(Math.random() * 1000); // Idk the formula, feel free to modify this
    } catch (error) {
      console.error(
        `Unable to get completed data for room ${index}. Error: `,
        error
      );
    }

    return roomBrief;
  }

  // Currently there are only 2 rooms available, so it will be hardcoded.
  // Should use something like $ROOMS env variable instead.
  private async getBriefAllRooms() {
    for (let i = 1; i <= 2; i++) {
      let roomBrief: RoomBriefData = await this.getRoomBrief(i);
      this.roomsBriefData.push(roomBrief);
    }
  }

  private async getWaterUsageLast30Days() {
    try {
      var result = await lastValueFrom(
        this.sensorDataService.getTotalWaterLast30Days()
      );
      if (result) {
        this.waterUsageLast30Days = result[0].total_usage ?? -1;
      }
    } catch (error) {
      console.error('Error while fetching total water usage: ', error);
    }
  }

  private async getElecUsageLast30Days() {
    try {
      var result = await lastValueFrom(
        this.sensorDataService.getTotalElecLast30Days()
      );
      if (result) {
        this.elecUsageLast30Days = result[0].total_usage ?? -1;
      }
    } catch (error) {
      console.error('Error while fetching total electricity usage: ', error);
    }
  }

  private async buildElecChartData() {
    var elecData = [];
    var elecChartData = [];
    var chartLabels = [];
    for (let i = -29; i <= 0; i++) {
      chartLabels.push(
        new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000).getUTCDate()
      );
    }
    for (let i = 1; i <= 2; i++) {
      let oneElec = await this.getElecUsage(i, -1);
      // The following code assume that
      elecData.push(oneElec);
    }
  }

  constructor() {
    this.getBriefAllRooms();
    this.getWaterUsageLast30Days();
    this.getElecUsageLast30Days();
  }
}
