import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {Item, ItemDataPage} from '../entities/item';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ItemDataPage>{
    const url = pageRequest.getPageRequestURL('items');
    const itemDataPage = await this.http.get<ItemDataPage>(ApiManager.getURL(url)).toPromise();
    itemDataPage.content = itemDataPage.content.map((item) => Object.assign(new Item(), item));
    return itemDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ItemDataPage>{
    const url = pageRequest.getPageRequestURL('items/basic');
    const itemDataPage = await this.http.get<ItemDataPage>(ApiManager.getURL(url)).toPromise();
    itemDataPage.content = itemDataPage.content.map((item) => Object.assign(new Item(), item));
    return itemDataPage;
  }

  async get(id: number): Promise<Item>{
    const item: Item = await this.http.get<Item>(ApiManager.getURL(`items/${id}`)).toPromise();
    return Object.assign(new Item(), item);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`items/${id}`)).toPromise();
  }

  async add(item: Item): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`items`), item).toPromise();
  }

  async update(id: number, item: Item): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`items/${id}`), item).toPromise();
  }

}
