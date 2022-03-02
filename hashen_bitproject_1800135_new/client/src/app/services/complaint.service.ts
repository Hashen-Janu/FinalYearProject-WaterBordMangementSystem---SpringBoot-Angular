import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Complaint, ComplaintDataPage} from '../entities/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ComplaintDataPage>{
    const url = pageRequest.getPageRequestURL('complaints');
    const complaintDataPage = await this.http.get<ComplaintDataPage>(ApiManager.getURL(url)).toPromise();
    complaintDataPage.content = complaintDataPage.content.map((complaint) => Object.assign(new Complaint(), complaint));
    return complaintDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ComplaintDataPage>{
    const url = pageRequest.getPageRequestURL('complaints/basic');
    const complaintDataPage = await this.http.get<ComplaintDataPage>(ApiManager.getURL(url)).toPromise();
    complaintDataPage.content = complaintDataPage.content.map((complaint) => Object.assign(new Complaint(), complaint));
    return complaintDataPage;
  }

  async get(id: number): Promise<Complaint>{
    const complaint: Complaint = await this.http.get<Complaint>(ApiManager.getURL(`complaints/${id}`)).toPromise();
    return Object.assign(new Complaint(), complaint);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`complaints/${id}`)).toPromise();
  }

  async add(complaint: Complaint): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`complaints`), complaint).toPromise();
  }

  async update(id: number, complaint: Complaint): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`complaints/${id}`), complaint).toPromise();
  }

  async getAllPendingComplains(pageRequest: PageRequest): Promise<ComplaintDataPage>{
    const url = pageRequest.getPageRequestURL('complaints/getAllPendingComplains');
    const complaintDataPage = await this.http.get<ComplaintDataPage>(ApiManager.getURL(url)).toPromise();
    complaintDataPage.content = complaintDataPage.content.map((complaint) => Object.assign(new Complaint(), complaint));
    return complaintDataPage;
  }
}
