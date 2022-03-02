import {City} from '../entities/city';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<City[]>{
    const cities = await this.http.get<City[]>(ApiManager.getURL('cities')).toPromise();
    return cities.map((city) => Object.assign(new City(), city));
  }

}
