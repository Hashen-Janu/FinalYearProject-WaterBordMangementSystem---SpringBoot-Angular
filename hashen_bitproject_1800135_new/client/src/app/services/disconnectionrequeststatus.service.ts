import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Disconnectionrequeststatus} from '../entities/disconnectionrequeststatus';

@Injectable({
  providedIn: 'root'
})
export class DisconnectionrequeststatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Disconnectionrequeststatus[]>{
    const disconnectionrequeststatuses = await this.http.get<Disconnectionrequeststatus[]>(ApiManager.getURL('disconnectionrequeststatuses')).toPromise();
    return disconnectionrequeststatuses.map((disconnectionrequeststatus) => Object.assign(new Disconnectionrequeststatus(), disconnectionrequeststatus));
  }

}
