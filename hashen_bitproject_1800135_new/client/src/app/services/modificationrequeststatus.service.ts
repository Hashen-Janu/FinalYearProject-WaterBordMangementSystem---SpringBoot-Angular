import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Modificationrequeststatus} from '../entities/modificationrequeststatus';

@Injectable({
  providedIn: 'root'
})
export class ModificationrequeststatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Modificationrequeststatus[]>{
    const modificationrequeststatuses = await this.http.get<Modificationrequeststatus[]>(ApiManager.getURL('modificationrequeststatuses')).toPromise();
    return modificationrequeststatuses.map((modificationrequeststatus) => Object.assign(new Modificationrequeststatus(), modificationrequeststatus));
  }

}
