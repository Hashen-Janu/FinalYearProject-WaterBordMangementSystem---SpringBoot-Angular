import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Iorderstatus} from '../entities/iorderstatus';

@Injectable({
  providedIn: 'root'
})
export class IorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Iorderstatus[]>{
    const iorderstatuses = await this.http.get<Iorderstatus[]>(ApiManager.getURL('iorderstatuses')).toPromise();
    return iorderstatuses.map((iorderstatus) => Object.assign(new Iorderstatus(), iorderstatus));
  }

}
