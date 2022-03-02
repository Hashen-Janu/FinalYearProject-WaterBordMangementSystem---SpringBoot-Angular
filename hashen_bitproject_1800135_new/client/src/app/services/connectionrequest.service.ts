import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Connectionrequest, ConnectionrequestDataPage} from '../entities/connectionrequest';

@Injectable({
  providedIn: 'root'
})
export class ConnectionrequestService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('connectionrequests');
    const connectionrequestDataPage = await this.http.get<ConnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    connectionrequestDataPage.content = connectionrequestDataPage.content.map((connectionrequest) => Object.assign(new Connectionrequest(), connectionrequest));
    return connectionrequestDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('connectionrequests/basic');
    const connectionrequestDataPage = await this.http.get<ConnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    connectionrequestDataPage.content = connectionrequestDataPage.content.map((connectionrequest) => Object.assign(new Connectionrequest(), connectionrequest));
    return connectionrequestDataPage;
  }

  async get(id: number): Promise<Connectionrequest>{
    const connectionrequest: Connectionrequest = await this.http.get<Connectionrequest>(ApiManager.getURL(`connectionrequests/${id}`)).toPromise();
    return Object.assign(new Connectionrequest(), connectionrequest);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`connectionrequests/${id}`)).toPromise();
  }

  async add(connectionrequest: Connectionrequest): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`connectionrequests`), connectionrequest).toPromise();
  }

  async update(id: number, connectionrequest: Connectionrequest): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`connectionrequests/${id}`), connectionrequest).toPromise();
  }

  async getPayslip(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`connectionrequests/${id}/payslip`)).toPromise();
  }

  async getRequestdetails(selectedId: number): Promise<Connectionrequest>{
    const connectionrequest: Connectionrequest = await this.http.get<Connectionrequest>(ApiManager.getURL(`connectionrequests/${selectedId}`)).toPromise();
    return Object.assign(new Connectionrequest(), connectionrequest);
  }

  async getAllDoneRequests(pageRequest: PageRequest): Promise<ConnectionrequestDataPage>{
    const url = pageRequest.getPageRequestURL('connectionrequests/getalldonerequests');
    const connectionrequestDataPage = await this.http.get<ConnectionrequestDataPage>(ApiManager.getURL(url)).toPromise();
    connectionrequestDataPage.content = connectionrequestDataPage.content.map((connectionrequest) => Object.assign(new Connectionrequest(), connectionrequest));
    return connectionrequestDataPage;
  }
}
