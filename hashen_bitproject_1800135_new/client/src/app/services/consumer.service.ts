import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Consumer, ConsumerDataPage} from '../entities/consumer';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConsumerDataPage>{
    const url = pageRequest.getPageRequestURL('consumers');
    const consumerDataPage = await this.http.get<ConsumerDataPage>(ApiManager.getURL(url)).toPromise();
    consumerDataPage.content = consumerDataPage.content.map((consumer) => Object.assign(new Consumer(), consumer));
    return consumerDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConsumerDataPage>{
    const url = pageRequest.getPageRequestURL('consumers/basic');
    const consumerDataPage = await this.http.get<ConsumerDataPage>(ApiManager.getURL(url)).toPromise();
    consumerDataPage.content = consumerDataPage.content.map((consumer) => Object.assign(new Consumer(), consumer));
    return consumerDataPage;
  }

  async get(id: number): Promise<Consumer>{
    const consumer: Consumer = await this.http.get<Consumer>(ApiManager.getURL(`consumers/${id}`)).toPromise();
    return Object.assign(new Consumer(), consumer);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`consumers/${id}`)).toPromise();
  }

  async add(consumer: Consumer): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`consumers`), consumer).toPromise();
  }

  async update(id: number, consumer: Consumer): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`consumers/${id}`), consumer).toPromise();
  }
  async getLanddeedphoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`consumers/${id}/landdeedphoto`)).toPromise();
  }
  async getGrcphoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`consumers/${id}/grcphoto`)).toPromise();
  }

}
