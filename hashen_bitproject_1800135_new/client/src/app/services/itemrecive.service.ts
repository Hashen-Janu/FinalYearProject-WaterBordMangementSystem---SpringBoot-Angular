import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Itemrecive, ItemreciveDataPage} from '../entities/itemrecive';

@Injectable({
  providedIn: 'root'
})
export class ItemreciveService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ItemreciveDataPage>{
    const url = pageRequest.getPageRequestURL('itemrecives');
    const itemreciveDataPage = await this.http.get<ItemreciveDataPage>(ApiManager.getURL(url)).toPromise();
    itemreciveDataPage.content = itemreciveDataPage.content.map((itemrecive) => Object.assign(new Itemrecive(), itemrecive));
    return itemreciveDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ItemreciveDataPage>{
    const url = pageRequest.getPageRequestURL('itemrecives/basic');
    const itemreciveDataPage = await this.http.get<ItemreciveDataPage>(ApiManager.getURL(url)).toPromise();
    itemreciveDataPage.content = itemreciveDataPage.content.map((itemrecive) => Object.assign(new Itemrecive(), itemrecive));
    return itemreciveDataPage;
  }

  async get(id: number): Promise<Itemrecive>{
    const itemrecive: Itemrecive = await this.http.get<Itemrecive>(ApiManager.getURL(`itemrecives/${id}`)).toPromise();
    return Object.assign(new Itemrecive(), itemrecive);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`itemrecives/${id}`)).toPromise();
  }

  async add(itemrecive: Itemrecive): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`itemrecives`), itemrecive).toPromise();
  }

  async update(id: number, itemrecive: Itemrecive): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`itemrecives/${id}`), itemrecive).toPromise();
  }

}
