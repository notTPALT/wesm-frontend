import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ElecData } from '../interfaces/elec-data';
import { WaterData } from '../interfaces/water-data';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  fetchedData: ElecData | WaterData | undefined = undefined;
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:3000/api/get';

  getWaterInfo(
    type: string,
    nodeId: string,
    sensorId: string,
    rows: string | undefined = undefined,
    date: string | undefined = undefined
  ) {
    var baseParams = new HttpParams();
    if (rows !== undefined) {
      baseParams = baseParams.set('rows', rows);
    }
    if (date !== undefined) {
      baseParams = baseParams.set('date', date);
    }
    baseParams = baseParams.set('node_id', nodeId);
    baseParams = baseParams.set('type', type);
    baseParams = baseParams.set('sensor_id', sensorId);

    this.http
      .get<ElecData | WaterData | undefined>(this.baseUrl, {
        params: baseParams,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
      .subscribe((result) => {
        if (type == 'water') this.fetchedData = result as WaterData;
        this.fetchedData = result as ElecData;
        console.log(result);
      });

    return this.fetchedData;
  }

  constructor() {}
}
