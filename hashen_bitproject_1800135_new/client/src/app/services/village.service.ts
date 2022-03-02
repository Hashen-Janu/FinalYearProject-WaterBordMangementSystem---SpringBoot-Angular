import {Injectable} from '@angular/core';
import {Village} from '../entities/village';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class VillageService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Village[]>{
    const villages = await this.http.get<Village[]>(ApiManager.getURL('villages')).toPromise();
    return villages.map((village) => Object.assign(new Village(), village));
  }

}
