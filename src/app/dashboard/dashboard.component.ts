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
  public totalWaterUsageLast30Days: number = -1;
  public totalElecUsageLast30Days: number = -1;

  // The following functions assume that the sensors only send data to database once a day.
  // Beware of that.
  private async getWaterUsage(
    index: number,
    date: string | undefined = undefined
  ) {
    try {
      const result = await lastValueFrom(
        this.sensorDataService.fetchWaterData(`water${index}`, date)
      );
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

  private async getElecUsage(
    index: number,
    date: string | undefined = undefined
  ) {
    try {
      const result = await lastValueFrom(
        this.sensorDataService.fetchElecData(`power${index}`, date)
      );
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
    var pastDate: string = new Date(new Date().setDate(1))
      .toISOString()
      .slice(0, 10);
    try {
      roomBrief = roomBrief || {};

      roomBrief.elecPast = await this.getElecUsage(index, pastDate);
      roomBrief.elecCurrent = await this.getElecUsage(index);
      roomBrief.waterPast = await this.getWaterUsage(index, pastDate);
      roomBrief.waterCurrent = await this.getWaterUsage(index);
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

  private async getTotalWaterUsageLast30Days() {
    var latest: number = 0;

    try {
      for (let i = 1; i <= 2; i++) {
        let a = await lastValueFrom(
          this.sensorDataService.fetchWaterData(`water${i}`)
        );
        if (a) {
          latest += a[0]?.water ?? 0;
        }

        let b = await lastValueFrom(
          this.sensorDataService.fetchWaterData(
            `water${i}`,
            new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          )
        );
        if (b) {
          latest -= b[0]?.water ?? 0;
        }
      }
    } catch (error) {
      console.error('Error while fetching total water usage: ', error);
    }

    this.totalWaterUsageLast30Days = latest;
  }

  private async getTotalElecUsageLast30Days() {
    var latest: number = 0;

    try {
      for (let i = 1; i <= 2; i++) {
        let a = await lastValueFrom(
          this.sensorDataService.fetchElecData(`power${i}`)
        );
        if (a) {
          latest += a[0]?.power ?? 0;
        }

        let b = await lastValueFrom(
          this.sensorDataService.fetchElecData(
            `power${i}`,
            new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          )
        );
        if (b) {
          latest -= b[0]?.power ?? 0;
        }
      }
    } catch (error) {
      console.error('Error while fetching total electricity usage: ', error);
    }

    this.totalElecUsageLast30Days = latest;
  }

  private async buildElecChartData() {
    var elecData = [];
    var elecChartData = [];
    var chartLabels = [];
    for (let i = -29; i <= 0; i++) {
      chartLabels.push(
        new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
          .getUTCDate()
          .toString()
      );
    }
  }

  constructor() {
    this.getBriefAllRooms();
    this.getTotalWaterUsageLast30Days();
    this.getTotalElecUsageLast30Days();
  }
}
