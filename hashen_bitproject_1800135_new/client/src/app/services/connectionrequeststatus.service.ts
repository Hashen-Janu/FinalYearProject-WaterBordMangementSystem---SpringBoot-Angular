import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Connectionrequeststatus} from '../entities/connectionrequeststatus';

@Injectable({
  providedIn: 'root'
})
export class ConnectionrequeststatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Connectionrequeststatus[]>{
    const connectionrequeststatuses = await this.http.get<Connectionrequeststatus[]>(ApiManager.getURL('connectionrequeststatuses')).toPromise();
    return connectionrequeststatuses.map((connectionrequeststatus) => Object.assign(new Connectionrequeststatus(), connectionrequeststatus));
  }

}
