import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Connectionstatus} from '../entities/connectionstatus';

@Injectable({
  providedIn: 'root'
})
export class ConnectionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Connectionstatus[]>{
    const connectionstatuses = await this.http.get<Connectionstatus[]>(ApiManager.getURL('connectionstatuses')).toPromise();
    return connectionstatuses.map((connectionstatus) => Object.assign(new Connectionstatus(), connectionstatus));
  }

}
