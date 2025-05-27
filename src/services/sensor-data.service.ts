import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ElecData } from '../interfaces/elec-data';
import { WaterData } from '../interfaces/water-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:3000/api/get';

  getWaterInfo(
    nodeId: string,
    sensorId: string,
    rows: number = 1,
    date: number = -1
  ) {
    var baseParams = new HttpParams();
    baseParams = baseParams.set('type', 'water');
    baseParams = baseParams.set('node_id', nodeId);
    baseParams = baseParams.set('sensor_id', sensorId);
    baseParams = baseParams.set('rows', rows.toString());
    if (date !== -1) baseParams = baseParams.set('date', date.toString());

    return this.http.get<WaterData[] | undefined>(
      this.baseUrl,
      {
        params: baseParams,
      }
    );
  }

  getElecInfo(
    nodeId: string,
    sensorId: string,
    rows: number = 1,
    date: number = -1
  ) {
    var baseParams = new HttpParams();
    baseParams = baseParams.set('type', 'elec');
    baseParams = baseParams.set('node_id', nodeId);
    baseParams = baseParams.set('sensor_id', sensorId);
    baseParams = baseParams.set('rows', rows.toString());
    if (date !== -1) baseParams = baseParams.set('date', date.toString());

    return this.http.get<ElecData[] | undefined>(
      this.baseUrl,
      {
        params: baseParams,
      }
    );
  }

  constructor() {}
}
