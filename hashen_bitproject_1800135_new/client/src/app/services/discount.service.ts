import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Discount, DiscountDataPage} from '../entities/discount';
import {Connection} from '../entities/connection';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DiscountDataPage>{
    const url = pageRequest.getPageRequestURL('discounts');
    const discountDataPage = await this.http.get<DiscountDataPage>(ApiManager.getURL(url)).toPromise();
    discountDataPage.content = discountDataPage.content.map((discount) => Object.assign(new Discount(), discount));
    return discountDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DiscountDataPage>{
    const url = pageRequest.getPageRequestURL('discounts/basic');
    const discountDataPage = await this.http.get<DiscountDataPage>(ApiManager.getURL(url)).toPromise();
    discountDataPage.content = discountDataPage.content.map((discount) => Object.assign(new Discount(), discount));
    return discountDataPage;
  }

  async get(id: number): Promise<Discount>{
    const discount: Discount = await this.http.get<Discount>(ApiManager.getURL(`discounts/${id}`)).toPromise();
    return Object.assign(new Discount(), discount);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`discounts/${id}`)).toPromise();
  }

  async add(discount: Discount): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`discounts`), discount).toPromise();
  }

  async update(id: number, discount: Discount): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`discounts/${id}`), discount).toPromise();
  }


}
