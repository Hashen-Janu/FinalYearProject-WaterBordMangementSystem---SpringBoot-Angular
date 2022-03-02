import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Reconnectionrequest, ReconnectionrequestDataPage} from '../entities/reconnectionrequest';

@Injectable({
  providedIn: 'root'
})
export class ReconnectionrequestService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ReconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('reconnectionrequests');
    const reconnectionrequestDataPage = await this.http.get<ReconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    reconnectionrequestDataPage.content = reconnectionrequestDataPage.content.map((reconnectionrequest) => Object.assign(new Reconnectionrequest(), reconnectionrequest));
    return reconnectionrequestDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ReconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('reconnectionrequests/basic');
    const reconnectionrequestDataPage = await this.http.get<ReconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    reconnectionrequestDataPage.content = reconnectionrequestDataPage.content.map((reconnectionrequest) => Object.assign(new Reconnectionrequest(), reconnectionrequest));
    return reconnectionrequestDataPage;
  }

  async get(id: number): Promise<Reconnectionrequest>{
    const reconnectionrequest: Reconnectionrequest = await this.http.get<Reconnectionrequest>(ApiManager.getURL(`reconnectionrequests/${id}`)).toPromise();
    return Object.assign(new Reconnectionrequest(), reconnectionrequest);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`reconnectionrequests/${id}`)).toPromise();
  }

  async add(reconnectionrequest: Reconnectionrequest): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`reconnectionrequests`), reconnectionrequest).toPromise();
  }

  async update(id: number, reconnectionrequest: Reconnectionrequest): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`reconnectionrequests/${id}`), reconnectionrequest).toPromise();
  }

  async getAllPendingReconnectionrequest(pageRequest: PageRequest): Promise<ReconnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('reconnectionrequests/getAllPendingReconnectionrequest');
    const reconnectionrequestDataPage = await this.http.get<ReconnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    reconnectionrequestDataPage.content = reconnectionrequestDataPage.content.map((reconnectionrequest) => Object.assign(new Reconnectionrequest(), reconnectionrequest));
    return reconnectionrequestDataPage;
  }
}
