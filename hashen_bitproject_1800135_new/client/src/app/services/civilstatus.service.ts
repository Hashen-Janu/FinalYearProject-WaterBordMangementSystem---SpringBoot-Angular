import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Civilstatus} from '../entities/civilstatus';

@Injectable({
  providedIn: 'root'
})
export class CivilstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Civilstatus[]>{
    const civilstatuses = await this.http.get<Civilstatus[]>(ApiManager.getURL('civilstatuses')).toPromise();
    return civilstatuses.map((civilstatus) => Object.assign(new Civilstatus(), civilstatus));
  }

}
