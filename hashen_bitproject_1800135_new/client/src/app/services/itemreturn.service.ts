import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Itemreturn, ItemreturnDataPage} from '../entities/itemreturn';

@Injectable({
  providedIn: 'root'
})
export class ItemreturnService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ItemreturnDataPage>{
    const url = pageRequest.getPageRequestURL('itemreturns');
    const itemreturnDataPage = await this.http.get<ItemreturnDataPage>(ApiManager.getURL(url)).toPromise();
    itemreturnDataPage.content = itemreturnDataPage.content.map((itemreturn) => Object.assign(new Itemreturn(), itemreturn));
    return itemreturnDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ItemreturnDataPage>{
    const url = pageRequest.getPageRequestURL('itemreturns/basic');
    const itemreturnDataPage = await this.http.get<ItemreturnDataPage>(ApiManager.getURL(url)).toPromise();
    itemreturnDataPage.content = itemreturnDataPage.content.map((itemreturn) => Object.assign(new Itemreturn(), itemreturn));
    return itemreturnDataPage;
  }

  async get(id: number): Promise<Itemreturn>{
    const itemreturn: Itemreturn = await this.http.get<Itemreturn>(ApiManager.getURL(`itemreturns/${id}`)).toPromise();
    return Object.assign(new Itemreturn(), itemreturn);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`itemreturns/${id}`)).toPromise();
  }

  async add(itemreturn: Itemreturn): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`itemreturns`), itemreturn).toPromise();
  }

  async update(id: number, itemreturn: Itemreturn): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`itemreturns/${id}`), itemreturn).toPromise();
  }

}
