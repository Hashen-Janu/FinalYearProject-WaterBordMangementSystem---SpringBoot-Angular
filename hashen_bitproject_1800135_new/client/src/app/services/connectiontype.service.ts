import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Connectiontype, ConnectiontypeDataPage} from '../entities/connectiontype';
import {Discount} from '../entities/discount';

@Injectable({
  providedIn: 'root'
})
export class ConnectiontypeService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConnectiontypeDataPage>{
    const url = pageRequest.getPageRequestURL('connectiontypes');
    const connectiontypeDataPage = await this.http.get<ConnectiontypeDataPage>(ApiManager.getURL(url)).toPromise();
    connectiontypeDataPage.content = connectiontypeDataPage.content.map((connectiontype) => Object.assign(new Connectiontype(), connectiontype));
    return connectiontypeDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConnectiontypeDataPage>{
    const url = pageRequest.getPageRequestURL('connectiontypes/basic');
    const connectiontypeDataPage = await this.http.get<ConnectiontypeDataPage>(ApiManager.getURL(url)).toPromise();
    connectiontypeDataPage.content = connectiontypeDataPage.content.map((connectiontype) => Object.assign(new Connectiontype(), connectiontype));
    return connectiontypeDataPage;
  }

  async get(id: number): Promise<Connectiontype>{
    const connectiontype: Connectiontype = await this.http.get<Connectiontype>(ApiManager.getURL(`connectiontypes/${id}`)).toPromise();
    return Object.assign(new Connectiontype(), connectiontype);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`connectiontypes/${id}`)).toPromise();
  }

  async add(connectiontype: Connectiontype): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`connectiontypes`), connectiontype).toPromise();
  }

  async update(id: number, connectiontype: Connectiontype): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`connectiontypes/${id}`), connectiontype).toPromise();
  }


}
