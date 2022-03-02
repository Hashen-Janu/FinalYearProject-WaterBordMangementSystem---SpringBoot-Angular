import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Userstatus} from '../entities/userstatus';

@Injectable({
  providedIn: 'root'
})
export class UserstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Userstatus[]>{
    const userstatuses = await this.http.get<Userstatus[]>(ApiManager.getURL('userstatuses')).toPromise();
    return userstatuses.map((userstatus) => Object.assign(new Userstatus(), userstatus));
  }

}
