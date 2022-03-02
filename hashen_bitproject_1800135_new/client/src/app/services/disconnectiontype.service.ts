import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Disconnectiontype} from '../entities/disconnectiontype';

@Injectable({
  providedIn: 'root'
})
export class DisconnectiontypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Disconnectiontype[]>{
    const disconnectiontypes = await this.http.get<Disconnectiontype[]>(ApiManager.getURL('disconnectiontypes')).toPromise();
    return disconnectiontypes.map((disconnectiontype) => Object.assign(new Disconnectiontype(), disconnectiontype));
  }

}
