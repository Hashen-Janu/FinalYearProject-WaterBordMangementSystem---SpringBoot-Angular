import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Nametitle} from '../entities/nametitle';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  async getYearWiseConsumerCount(count: number): Promise<any[]>{
    const url = ApiManager.getURL('reports/year-wise-consumer-count/' + count);
    return await this.http.get<any[]>(url).toPromise();

  }
  async getYearWiseConnectionCount(count: number): Promise<any[]>{
    const url = ApiManager.getURL('reports/year-wise-connection-count/' + count);
    return await this.http.get<any[]>(url).toPromise();

  }
  async getGDivWiseConnectionCount(): Promise<any[]>{
    const url = ApiManager.getURL('reports/gdiv-wise-connection');
    return await this.http.get<any[]>(url).toPromise();
  }
}
