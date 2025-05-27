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
    rows: string | undefined = undefined,
    date: string | undefined = undefined
  ) {
    var baseParams = new HttpParams();
    baseParams = baseParams.set('type', 'water');
    baseParams = baseParams.set('node_id', nodeId);
    baseParams = baseParams.set('sensor_id', sensorId);

    if (rows !== undefined) {
      baseParams = baseParams.set('rows', rows);
    }
    if (date !== undefined) {
      baseParams = baseParams.set('date', date);
    }

    return this.http.get<WaterData[] | undefined>(
      this.baseUrl,
      {
        params: baseParams,
      }
    ) as Observable<WaterData[] | undefined>;

    // this.http.get<WaterData | undefined>(
    //   this.baseUrl,
    //   {
    //     params: baseParams,
    //   }
    // ).subscribe((result) => {
    //   this.fetchedData = result;
    //   return this.fetchedData;
    // })
    // return undefined;
  }

  constructor() {}
}
