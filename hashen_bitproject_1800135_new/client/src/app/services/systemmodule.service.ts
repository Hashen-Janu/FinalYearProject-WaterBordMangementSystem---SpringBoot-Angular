import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Systemmodule} from '../entities/systemmodule';

@Injectable({
  providedIn: 'root'
})
export class SystemmoduleService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Systemmodule[]>{
    let systemmodules = await this.http.get<Systemmodule[]>(ApiManager.getURL('systemmodules')).toPromise();
    systemmodules = systemmodules.map((systemmodule) => Object.assign(new Systemmodule(), systemmodule));
    return systemmodules;
  }
}
