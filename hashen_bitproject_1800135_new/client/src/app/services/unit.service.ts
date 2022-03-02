import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Gender} from '../entities/gender';
import {ApiManager} from '../shared/api-manager';
import {Unit} from '../entities/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Unit[]>{
    const units = await this.http.get<Unit[]>(ApiManager.getURL('units')).toPromise();
    return units.map((unit) => Object.assign(new Unit(), unit));
  }

}
