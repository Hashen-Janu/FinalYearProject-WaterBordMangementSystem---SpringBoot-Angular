import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Disposal, DisposalDataPage} from '../entities/disposal';

@Injectable({
  providedIn: 'root'
})
export class DisposalService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DisposalDataPage>{
    const url = pageRequest.getPageRequestURL('disposals');
    const disposalDataPage = await this.http.get<DisposalDataPage>(ApiManager.getURL(url)).toPromise();
    disposalDataPage.content = disposalDataPage.content.map((disposal) => Object.assign(new Disposal(), disposal));
    return disposalDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DisposalDataPage>{
    const url = pageRequest.getPageRequestURL('disposals/basic');
    const disposalDataPage = await this.http.get<DisposalDataPage>(ApiManager.getURL(url)).toPromise();
    disposalDataPage.content = disposalDataPage.content.map((disposal) => Object.assign(new Disposal(), disposal));
    return disposalDataPage;
  }

  async get(id: number): Promise<Disposal>{
    const disposal: Disposal = await this.http.get<Disposal>(ApiManager.getURL(`disposals/${id}`)).toPromise();
    return Object.assign(new Disposal(), disposal);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`disposals/${id}`)).toPromise();
  }

  async add(disposal: Disposal): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`disposals`), disposal).toPromise();
  }

  async update(id: number, disposal: Disposal): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`disposals/${id}`), disposal).toPromise();
  }

}
