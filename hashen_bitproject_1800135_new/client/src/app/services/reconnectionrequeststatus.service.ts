import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Reconnectionrequeststatus} from '../entities/reconnectionrequeststatus';

@Injectable({
  providedIn: 'root'
})
export class ReconnectionrequeststatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Reconnectionrequeststatus[]>{
    const reconnectionrequeststatuses = await this.http.get<Reconnectionrequeststatus[]>(ApiManager.getURL('reconnectionrequeststatuses')).toPromise();
    return reconnectionrequeststatuses.map((reconnectionrequeststatus) => Object.assign(new Reconnectionrequeststatus(), reconnectionrequeststatus));
  }

}
