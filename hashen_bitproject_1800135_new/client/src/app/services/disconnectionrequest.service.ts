import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Disconnectionrequest, DisconnectionrequestDataPage} from '../entities/disconnectionrequest';

@Injectable({
  providedIn: 'root'
})
export class DisconnectionrequestService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DisconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('disconnectionrequests');
    const disconnectionrequestDataPage = await this.http.get<DisconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    disconnectionrequestDataPage.content = disconnectionrequestDataPage.content.map((disconnectionrequest) => Object.assign(new Disconnectionrequest(), disconnectionrequest));
    return disconnectionrequestDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DisconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('disconnectionrequests/basic');
    const disconnectionrequestDataPage = await this.http.get<DisconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    disconnectionrequestDataPage.content = disconnectionrequestDataPage.content.map((disconnectionrequest) => Object.assign(new Disconnectionrequest(), disconnectionrequest));
    return disconnectionrequestDataPage;
  }

  async get(id: number): Promise<Disconnectionrequest>{
    const disconnectionrequest: Disconnectionrequest = await this.http.get<Disconnectionrequest>(ApiManager.getURL(`disconnectionrequests/${id}`)).toPromise();
    return Object.assign(new Disconnectionrequest(), disconnectionrequest);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`disconnectionrequests/${id}`)).toPromise();
  }

  async add(disconnectionrequest: Disconnectionrequest): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`disconnectionrequests`), disconnectionrequest).toPromise();
  }

  async update(id: number, disconnectionrequest: Disconnectionrequest): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`disconnectionrequests/${id}`), disconnectionrequest).toPromise();
  }

  async getAllPendingDisconnectionrequest(pageRequest: PageRequest): Promise<DisconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('disconnectionrequests/getAllPendingDisconnectionrequest');
    const disconnectionrequestDataPage = await this.http.get<DisconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    disconnectionrequestDataPage.content = disconnectionrequestDataPage.content.map((disconnectionrequest) => Object.assign(new Disconnectionrequest(), disconnectionrequest));
    return disconnectionrequestDataPage;
  }
}
