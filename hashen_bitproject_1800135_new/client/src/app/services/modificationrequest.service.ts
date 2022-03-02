import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Modificationrequest, ModificationrequestDataPage} from '../entities/modificationrequest';

@Injectable({
  providedIn: 'root'
})
export class ModificationrequestService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ModificationrequestDataPage>{
    const url = pageRequest.getPageRequestURL('modificationrequests');
    const modificationrequestDataPage = await this.http.get<ModificationrequestDataPage>(ApiManager.getURL(url)).toPromise();
    modificationrequestDataPage.content = modificationrequestDataPage.content.map((modificationrequest) => Object.assign(new Modificationrequest(), modificationrequest));
    return modificationrequestDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ModificationrequestDataPage>{
    const url = pageRequest.getPageRequestURL('modificationrequests/basic');
    const modificationrequestDataPage = await this.http.get<ModificationrequestDataPage>(ApiManager.getURL(url)).toPromise();
    modificationrequestDataPage.content = modificationrequestDataPage.content.map((modificationrequest) => Object.assign(new Modificationrequest(), modificationrequest));
    return modificationrequestDataPage;
  }

  async get(id: number): Promise<Modificationrequest>{
    const modificationrequest: Modificationrequest = await this.http.get<Modificationrequest>(ApiManager.getURL(`modificationrequests/${id}`)).toPromise();
    return Object.assign(new Modificationrequest(), modificationrequest);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`modificationrequests/${id}`)).toPromise();
  }

  async add(modificationrequest: Modificationrequest): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`modificationrequests`), modificationrequest).toPromise();
  }

  async update(id: number, modificationrequest: Modificationrequest): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`modificationrequests/${id}`), modificationrequest).toPromise();
  }

  async getAllPendingModificationrequest(pageRequest: PageRequest): Promise<ModificationrequestDataPage>{
    const url = pageRequest.getPageRequestURL('modificationrequests/getAllPendingModificationrequest');
    const modificationrequestDataPage = await this.http.get<ModificationrequestDataPage>(ApiManager.getURL(url)).toPromise();
    modificationrequestDataPage.content = modificationrequestDataPage.content.map((modificationrequest) => Object.assign(new Modificationrequest(), modificationrequest));
    return modificationrequestDataPage;
  }
}
