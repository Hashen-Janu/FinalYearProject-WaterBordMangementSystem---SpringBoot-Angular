import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Iorder, IorderDataPage} from '../entities/iorder';

@Injectable({
  providedIn: 'root'
})
export class IorderService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<IorderDataPage>{
    const url = pageRequest.getPageRequestURL('iorders');
    const iorderDataPage = await this.http.get<IorderDataPage>(ApiManager.getURL(url)).toPromise();
    iorderDataPage.content = iorderDataPage.content.map((iorder) => Object.assign(new Iorder(), iorder));
    return iorderDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<IorderDataPage>{
    const url = pageRequest.getPageRequestURL('iorders/basic');
    const iorderDataPage = await this.http.get<IorderDataPage>(ApiManager.getURL(url)).toPromise();
    iorderDataPage.content = iorderDataPage.content.map((iorder) => Object.assign(new Iorder(), iorder));
    return iorderDataPage;
  }

  async get(id: number): Promise<Iorder>{
    const iorder: Iorder = await this.http.get<Iorder>(ApiManager.getURL(`iorders/${id}`)).toPromise();
    return Object.assign(new Iorder(), iorder);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`iorders/${id}`)).toPromise();
  }

  async add(iorder: Iorder): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`iorders`), iorder).toPromise();
  }

  async update(id: number, iorder: Iorder): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`iorders/${id}`), iorder).toPromise();
  }

}
